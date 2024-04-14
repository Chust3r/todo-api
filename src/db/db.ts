import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { Database } from 'bun:sqlite'
import * as schema from './schema'

const sqlite = new Database('db.sqlite')

export const db = drizzle(sqlite, { schema })

migrate(db, { migrationsFolder: 'src/db/migrations' })

// → TYPES

const { user, verificationToken } = schema

type NewUser = typeof user.$inferInsert

// → UTILS

export const addUser = async (data: NewUser) => {
	return await db.insert(user).values(data)
}

export const getUser = async (email: string) => {
	return await db.query.user.findFirst({ where: eq(user.email, email) })
}

export const upadateUser = async (id: string, data: Partial<NewUser>) => {
	return await db.update(user).set(data).where(eq(user.id, id))
}

export const addEmailVerificationToken = async (
	token: string,
	userId: string
) => {
	return await db.insert(verificationToken).values({ token, userId })
}

export const getEmailVerificationToken = async (token: string) => {
	return await db.query.verificationToken.findFirst({
		where: eq(verificationToken.token, token),
	})
}

export const deleteEmailVerificationToken = async (token: string) => {
	return await db
		.delete(verificationToken)
		.where(eq(verificationToken.token, token))
}
