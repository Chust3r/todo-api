import { Elysia } from 'elysia'
import { jwt } from '@libs/jwt'
import { authMiddleware } from '@middlewares/auth'
import { cookie } from '@schemas/request'
import { resend } from '@libs/resend'
import {
	deleteEmailVerificationToken,
	addEmailVerificationToken,
	getUser,
} from '@db/db'

const schema = {
	cookie,
}

export const resendEmail = new Elysia()
	.use(jwt)
	.use(authMiddleware)
	.get(
		'/resend',
		async ({ jwt, cookie }) => {
			try {
				const payload = await jwt.verify(cookie?.auth?.value?.token)

				if (!payload) {
					return Response.json(undefined, { status: 401 })
				}

				// → CHECK USER

				const user = await getUser(payload?.email as string)

				if (user?.emailVerified) {
					return Response.json(undefined, { status: 401 })
				}

				await deleteEmailVerificationToken(payload?.id as string)

				const token = crypto.randomUUID()

				await addEmailVerificationToken(payload?.id as string, token)

				await resend.emails.send({
					from: 'Acme <onboarding@resend.dev>',
					to: [payload?.email] as string[],
					subject: 'Todo - Verify your email',
					html: `Verify your email <a href="http://localhost:3000/auth/email/verify?token=${token}">here</a>`,
				})

				return Response.json({
					message: 'AUTH RESEND EMAIL',
				})
			} catch (e) {
				console.log('[AUTH] RESEND EMAIL ERROR')
				return Response.json(undefined, { status: 500 })
			}
		},
		schema
	)
