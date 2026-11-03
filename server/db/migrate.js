// npm run db:migrate — idempotent schema setup.
// Better Auth's tables are created first because schema.sql has foreign keys to "user".
import './use-direct-connection.js'
import { readFile } from 'node:fs/promises'
import { getMigrations } from 'better-auth/db/migration'
import { auth } from '../src/auth.js'
import { pool } from '../src/db.js'

const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options)
if (toBeCreated.length || toBeAdded.length) {
  await runMigrations()
  console.log(`Auth tables ready (created: ${toBeCreated.map((t) => t.table).join(', ') || 'none'}).`)
} else {
  console.log('Auth tables already up to date.')
}

const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
await pool.query(schema)
console.log('Site tables ready.')

await pool.end()
