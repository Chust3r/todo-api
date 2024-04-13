import Elysia from 'elysia'

export const logout = new Elysia().get('/logout', () => {
	return Response.json({
		message: 'AUTH LOGOUT',
	})
})
