import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 } from 'uuid'

export const user = sqliteTable('users', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$defaultFn(() => v4()),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
})
