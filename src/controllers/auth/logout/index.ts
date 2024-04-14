import { Elysia } from 'elysia'
import { cookie } from '@schemas/request'

const schema = {
	cookie,
}

// TODO: IMPLEMENT LOGOUT IN DB

export const logout = new Elysia().get(
	'/logout',
	async ({ cookie }) => {
		try {
			cookie.auth.remove()

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] LOGOUT ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
