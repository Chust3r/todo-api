import type Elysia from 'elysia'

export const reset = (app: Elysia) => {
	return app.get('/reset', () => {
		return Response.json({
			message: 'AUTH PASSWORD RESET',
		})
	})
}
