import type Elysia from 'elysia'

export const resetEmail = (app: Elysia) => {
	return app.get('/reset/email', () => {
		return Response.json({
			message: 'AUTH PASSWORD RESET EMAIL',
		})
	})
}
