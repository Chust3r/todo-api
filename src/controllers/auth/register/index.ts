import { Elysia, t } from 'elysia'
import { resend } from '@/libs/resend'

// → DATABASE

import { db, users, verificationToken as vToken } from '@db'

// → BODY SCHEMA

const body = t.Object({
	email: t.String(),
	password: t.String(),
})

const schema = {
	body,
}

export const register = new Elysia().post(
	'/register',
	async ({ body }) => {
		try {
			const { email, password } = body

			const exists = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			})

			if (exists) {
				return Response.json(undefined, {
					status: 409,
				})
			}

			const hash = await Bun.password.hash(password, {
				algorithm: 'argon2i',
				memoryCost: 1024,
				timeCost: 3,
			})

			const user = await db
				.insert(users)
				.values({
					email,
					password: hash,
				})
				.returning()

			const token = crypto.randomUUID()

			await db.insert(vToken).values({
				userId: user[0].id,
				token,
			})

			await resend.emails.send({
				from: 'Todofy <onboarding@resend.dev>',
				to: [email],
				subject: 'Todofy - Verify your email',
				html: `Please verify your email <a href="http://localhost:3000/auth/email/verify?token=${token}">here</a>`,
			})

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] REGISTER ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
