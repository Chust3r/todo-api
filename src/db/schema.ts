import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { v4 } from 'uuid'

export const users = sqliteTable('users', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => v4()),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	emailVerified: integer('verified', { mode: 'boolean' }).default(false),
})

export const userRelations = relations(users, ({ one }) => ({
	verificationToken: one(verificationToken, {
		fields: [users.id],
		references: [verificationToken.userId],
	}),
}))

export const verificationToken = sqliteTable('verification_tokens', {
	id: text('id').notNull().primaryKey().default(v4()),
	token: text('token').notNull(),
	userId: text('user_id').references(() => users.id),
	createdAt: integer('created_at').notNull().default(Date.now()),
	expiresAt: integer('expires_at')
		.notNull()
		.default(Date.now() + 1000 * 60 * 60),
})

export const resetPasswordTokens = sqliteTable('reset_password_tokens', {
	id: text('id').notNull().primaryKey().default(v4()),
	token: text('token').notNull(),
	createdAt: integer('created_at').notNull().default(Date.now()),
	expiresAt: integer('expires_at')
		.notNull()
		.default(Date.now() + 1000 * 60 * 60),
	email: text('email')
		.notNull()
		.unique()
		.references(() => users.email),
})
