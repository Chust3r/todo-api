import { Elysia, t } from 'elysia'
import { cookie } from '@schemas/request'
import { authMiddleware } from '@middlewares/auth'

// → DATABASE

import { db, users } from '@db'
import { eq } from 'drizzle-orm'

const body = t.Object({
	password: t.String(),
	newPassword: t.String(),
})

const schema = {
	cookie,
	body,
}

export const update = new Elysia().use(authMiddleware).post(
	'/update',
	async ({ cookie, jwt, body }) => {
		try {
			const token = cookie?.auth?.value?.token

			const payload = await jwt.verify(token)

			if (!payload) {
				return Response.json(undefined, { status: 401 })
			}

			const user = await db.query.users.findFirst({
				where: (users) => eq(users.id, payload?.id as string),
			})

			if (!user) {
				return Response.json(undefined, { status: 401 })
			}

			const isValid = await Bun.password.verify(body.password, user.password)

			if (!isValid) {
				return Response.json(undefined, { status: 401 })
			}

			const password = await Bun.password.hash(body.newPassword, {
				algorithm: 'argon2i',
				memoryCost: 1024,
				timeCost: 3,
			})

			await db
				.update(users)
				.set({ password })
				.where(eq(users.id, payload?.id as string))

			return Response.json(undefined, { status: 200 })
		} catch (e) {
			console.log('[AUTH] PASSWORD UPDATE ERROR')
			return Response.json(undefined, { status: 500 })
		}
	},
	schema
)
