import { Elysia, t } from 'elysia'
import { resend } from '@libs/resend'

// → DATABASE

import { db, resetPasswordTokens } from '@db'
import { eq } from 'drizzle-orm'

const body = t.Object({
	email: t.String(),
})

const schema = {
	body,
}

export const reset = new Elysia().post(
	'/reset',
	async ({ body }) => {
		try {
			const { email } = body

			const user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			})

			if (!user) {
				return Response.json(undefined, { status: 404 })
			}

			if (!user.emailVerified) {
				return Response.json(undefined, { status: 403 })
			}

			const existsReq = await db.query.resetPasswordTokens.findFirst({
				where: (resetPasswordTokens, { eq }) =>
					eq(resetPasswordTokens.email, email),
			})

			if (existsReq && existsReq.expiresAt > Date.now()) {
				return Response.json(undefined, { status: 409 })
			}

			await db
				.delete(resetPasswordTokens)
				.where(eq(resetPasswordTokens.email, email))

			const token = crypto.randomUUID()

			await db.insert(resetPasswordTokens).values({
				email,
				token,
			})

			await resend.emails.send({
				from: 'Todofy <onboarding@resend.dev>',
				to: email,
				subject: 'Todofy - Reset your password',
				html: `Reset your password <a href="http://localhost:3000/auth/password/reset/${token}">here</a>`,
			})

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] PASSWORD RESET ERROR', e)
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
