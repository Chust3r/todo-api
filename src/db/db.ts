import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './schema'

const sqlite = new Database('db.sqlite')

export const db = drizzle(sqlite, { schema })
export * from './schema'

try {
	migrate(db, { migrationsFolder: 'src/db/migrations' })
} catch (e) {
	console.log('DB is already migrated')
}
