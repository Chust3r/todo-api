import { Elysia, t } from 'elysia'
import { getUser } from '@db/db'
import { jwt, refresh } from '@libs/jwt'
import { cookie } from '@schemas/request'

// → SCHEMA

const body = t.Object({
	email: t.String(),
	password: t.String(),
})

const schema = {
	body,
	cookie,
}

export const login = new Elysia()
	.use(jwt)
	.use(refresh)
	.post(
		'/login',
		async ({ body, jwt, refresh, cookie }) => {
			try {
				const user = await getUser(body.email)

				if (!user) {
					return Response.json(undefined, { status: 401 })
				}

				// → CHECK PASSWORD

				const { id, email, password } = user

				const isValid = await Bun.password.verify(body.password, password)

				if (!isValid) {
					return Response.json(undefined, { status: 401 })
				}

				const token = await jwt.sign({
					id,
					email,
				})

				const refreshToken = await refresh.sign({ id, email })

				// → SET COOKIE

				cookie.auth.set({
					value: {
						token,
						refresh: refreshToken,
					},
					httpOnly: true,
					sameSite: true,
				})

				return Response.json(undefined, {
					status: 200,
				})
			} catch (e) {
				console.log('[AUTH] LOGIN ERROR')
				return Response.json(undefined, { status: 401 })
			}
		},
		schema
	)
