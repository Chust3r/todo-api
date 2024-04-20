import { Elysia, t } from 'elysia'

// → DATABASE

import { db, users, verificationToken as vToken } from '@db'
import { eq } from 'drizzle-orm'

// → SCHEMA

const query = t.Object({
	token: t.String(),
})

const schema = {
	query,
}

export const verifyEmail = new Elysia().get(
	'/verify',
	async ({ query }) => {
		try {
			const { token } = query

			const verificationToken = await db.query.verificationToken.findFirst({
				where: (tokens, { eq }) => eq(tokens.token, token),
			})

			if (!verificationToken) {
				return Response.json(undefined, { status: 404 })
			}

			const { expiresAt, userId } = verificationToken

			if (Date.now() > expiresAt) {
				return Response.json(undefined, { status: 400 })
			}

			await db
				.update(users)
				.set({ emailVerified: true })
				.where(eq(users.id, userId as string))

			await db.delete(vToken).where(eq(vToken.token, token))

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] EMAIL VERIFY ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
