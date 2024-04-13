import Elysia from 'elysia'

// → PASSWORD SERVICES

import { update } from './update'
import { reset } from './reset'
import { resetEmail } from './reset-email'

export const password = new Elysia().group('/password', (app) => {
	return app.use(update).use(reset).use(resetEmail)
})
