import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { eq } from 'drizzle-orm'
import { Database } from 'bun:sqlite'
import * as schema from './schema'

const sqlite = new Database('db.sqlite')

export const db = drizzle(sqlite, { schema })

migrate(db, { migrationsFolder: 'src/db/migrations' })

// → TYPES

const { user } = schema

type NewUser = typeof user.$inferInsert

// → UTILS

export const addUser = async (data: NewUser) => {
	return await db.insert(user).values(data)
}

export const getUser = async (email: string) => {
	return await db.query.user.findFirst({ where: eq(user.email, email) })
}
