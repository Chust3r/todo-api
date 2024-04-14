import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { v4 } from 'uuid'

export const user = sqliteTable('users', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => v4()),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	emailVerified: integer('verified', { mode: 'boolean' }).default(false),
})

export const verificationToken = sqliteTable('verification_tokens', {
	id: text('id').notNull().primaryKey().default(v4()),
	token: text('token').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: integer('created_at').notNull().default(Date.now()),
	expiresAt: integer('expires_at')
		.notNull()
		.default(Date.now() + 1000 * 60 * 60 * 24),
})

export const userRelations = relations(user, ({ one }) => ({
	verifyToken: one(verificationToken, {
		fields: [user.id],
		references: [verificationToken.userId],
	}),
}))
