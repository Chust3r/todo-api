import { Elysia } from 'elysia'
import { authMiddleware } from '@middlewares/auth'
import { cookie } from '@schemas/request'
import { jwt } from '@libs/jwt'
import { getUser } from '@db/db'

const schema = {
	cookie,
}

export const user = new Elysia()
	.use(authMiddleware)
	.use(jwt)
	.get(
		'/user',
		async ({ jwt, cookie }) => {
			try {
				const token = cookie?.auth?.value?.token

				const payload = await jwt.verify(token)

				if (!payload) {
					return Response.json(undefined, { status: 401 })
				}

				const user = await getUser(payload.id as string)

				return Response.json({
					...user,
					password: undefined,
				})
			} catch (e) {
				console.log('[AUTH] USER ERROR')
				return Response.json(undefined, { status: 500 })
			}
		},
		schema
	)
