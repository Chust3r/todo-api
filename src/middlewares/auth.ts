import { Elysia } from 'elysia'
import { jwt } from '@libs/jwt'
import { cookie } from '@schemas/request'

//→ TODO: UPDATE REFRESH TOKEN

export const authMiddleware = new Elysia()
	.use(jwt)
	.guard({ cookie })
	.onBeforeHandle({ as: 'global' }, async ({ jwt, cookie }) => {
		try {
			const token = cookie?.auth?.value?.token

			if (!token) {
				return Response.json(undefined, { status: 401 })
			}

			const payload = await jwt.verify(token)

			if (!payload) {
				return Response.json(undefined, { status: 401 })
			}
		} catch (e) {
			console.log('[AUTH] MIDDLEWARE ERROR', e)
			return Response.json(undefined, { status: 500 })
		}
	})
