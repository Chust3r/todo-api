import type Elysia from 'elysia'

export const update = (app: Elysia) => {
	return app.get('/update', () => {
		return Response.json({
			message: 'AUTH PASSWORD UPDATE',
		})
	})
}
