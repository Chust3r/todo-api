import { Elysia, t } from 'elysia'

// → DATABASE

import { db, resetPasswordTokens, users } from '@db'
import { eq } from 'drizzle-orm'

const body = t.Object({
	password: t.String(),
})

const query = t.Object({
	token: t.String(),
})

const schema = {
	body,
	query,
}

export const resetToken = new Elysia().put(
	'/reset',
	async ({ body, query }) => {
		try {
			const { token } = query

			const { password } = body

			const existsToken = await db.query.resetPasswordTokens.findFirst({
				where: (tokens, { eq }) => eq(tokens.token, token),
			})

			if (!existsToken) {
				return Response.json(undefined, { status: 404 })
			}

			if (Date.now() > existsToken.expiresAt) {
				return Response.json(undefined, { status: 400 })
			}

			const hash = await Bun.password.hash(password, {
				algorithm: 'argon2i',
				memoryCost: 1024,
				timeCost: 3,
			})

			await db
				.update(users)
				.set({ password: hash })
				.where(eq(users.email, existsToken.email))

			await db
				.delete(resetPasswordTokens)
				.where(eq(resetPasswordTokens.token, token))

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] RESET PASSWORD TOKEN ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
