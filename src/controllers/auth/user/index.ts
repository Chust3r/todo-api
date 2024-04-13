import { Elysia } from 'elysia'
import { authMiddleware } from '@middlewares/auth'

export const user = new Elysia().use(authMiddleware).get('/user', async () => {
	return Response.json({
		message: 'AUTH USER',
	})
})
