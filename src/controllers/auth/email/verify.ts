import {
	getEmailVerificationToken,
	upadateUser,
	deleteEmailVerificationToken,
} from '@db/db'
import { Elysia, t } from 'elysia'

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

			const verificationToken = await getEmailVerificationToken(token)

			if (!verificationToken) {
				return Response.json(undefined, { status: 404 })
			}

			const { expiresAt, userId } = verificationToken

			if (Date.now() > expiresAt) {
				return Response.json(undefined, { status: 400 })
			}

			await upadateUser(userId, { emailVerified: true })

			await deleteEmailVerificationToken(token)

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] EMAIL VERIFY ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
