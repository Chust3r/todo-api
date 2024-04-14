import { Elysia, t } from 'elysia'
import { addEmailVerificationToken, addUser, getUser } from '@/db/db'
import { resend } from '@/libs/resend'

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

			const user = await getUser(email)

			if (user) {
				return Response.json(undefined, {
					status: 409,
				})
			}

			const hash = await Bun.password.hash(password, {
				algorithm: 'argon2i',
				memoryCost: 1024,
				timeCost: 3,
			})

			await addUser({
				email,
				password: hash,
			})

			const token = crypto.randomUUID()

			const data = await getUser(email)

			await addEmailVerificationToken(token, data?.id as string)

			await resend.emails.send({
				from: 'Acme <onboarding@resend.dev>',
				to: [email],
				subject: 'Todo - Verify your email',
				html: `Verify your email <a href="http://localhost:3000/auth/email/verify?token=${token}">here</a>`,
			})

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] REGISTER ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
