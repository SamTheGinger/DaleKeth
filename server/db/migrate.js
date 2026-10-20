// Creates (or updates) every table: `npm run db:migrate`. Safe to run more than once.
//   1. Better Auth creates its own tables (user, session, account, verification).
//   2. Our schema.sql creates the site's tables, some of which point at "user".
import './use-direct-connection.js' // Must be first: use Neon's direct (unpooled) address for this script.
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
await pool.query(schema) // A file with several statements can be sent in one go.
console.log('Site tables ready.')

await pool.end() // Close the connections so the script can finish.
