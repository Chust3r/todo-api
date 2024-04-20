import { Elysia } from 'elysia'
import { cookie } from '@schemas/request'
import { authMiddleware } from '@middlewares/auth'

export const update = new Elysia().post('/update', async () => {
	try {
		return Response.json(undefined, { status: 200 })
	} catch (e) {
		console.log('[AUTH] PASSWORD UPDATE ERROR')
	}
})
