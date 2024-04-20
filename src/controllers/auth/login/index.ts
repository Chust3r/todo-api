import { Elysia, t } from 'elysia'
import { jwt, refresh } from '@libs/jwt'
import { cookie } from '@schemas/request'

// → DATABASE

import { db } from '@db'

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
				const user = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.email, body.email),
				})

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
