import Elysia from 'elysia'

export const email = new Elysia().get('/email', () => {
	return Response.json({
		message: 'AUTH EMAIL',
	})
})
