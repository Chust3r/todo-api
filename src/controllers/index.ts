import type { Elysia } from 'elysia'

// → controllers

import { authController } from './auth'

export const controllers = (app: Elysia) => {
	return app.use(authController)
}
