import { Elysia } from 'elysia'
import { verifyEmail } from './verify'
import { resendEmail } from './resend'

export const email = new Elysia().group('/email', (app) => {
	return app.use(verifyEmail).use(resendEmail)
})
