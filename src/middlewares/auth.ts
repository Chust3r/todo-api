import { Elysia } from 'elysia'
import { jwt, refresh } from '@libs/jwt'
import { cookie } from '@schemas/request'

export const authMiddleware = new Elysia()
	.use(jwt)
	.use(refresh)
	.guard({ cookie })
	.onBeforeHandle({ as: 'global' }, async ({ jwt, refresh, cookie }) => {
		try {
			const token = cookie?.auth?.value?.token

			const refresh_token = cookie?.auth?.value?.refresh

			if (!token || !refresh_token) {
				return Response.json(undefined, { status: 401 })
			}

			const payload = await jwt.verify(token)

			const payload_refresh = await refresh.verify(refresh_token)

			if (payload) {
				return
			}

			if (!payload_refresh) {
				return Response.json(undefined, { status: 401 })
			}

			const new_token = await jwt.sign({
				id: payload_refresh.id,
				email: payload_refresh.email,
			})

			const new_refresh_token = await refresh.sign({
				id: payload_refresh.id,
				email: payload_refresh.email,
			})

			cookie.auth.set({
				value: {
					token: new_token,
					refresh: new_refresh_token,
				},
				httpOnly: true,
				sameSite: true,
			})
		} catch (e) {
			console.log('[AUTH] MIDDLEWARE ERROR', e)
			return Response.json(undefined, { status: 500 })
		}
	})
