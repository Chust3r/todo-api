import { Elysia, t } from 'elysia'
import { addUser, getUser } from '@/db/db'

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

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] REGISTER ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
