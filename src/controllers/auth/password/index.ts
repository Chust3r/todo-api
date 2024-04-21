import { Elysia } from 'elysia'

// → PASSWORD SERVICES

import { update } from './update'
import { reset } from './reset'
import { resetToken } from './reset-token'

export const password = new Elysia().group('/password', (app) => {
	return app.use(reset).use(resetToken).use(update)
})
