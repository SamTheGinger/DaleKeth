// Imported first by the db/ scripts so src/db.js connects with Neon's direct (unpooled) URL.
// The pooler (PgBouncer, transaction mode) doesn't preserve session state, which DDL and setval() rely on.
import 'dotenv/config'

if (process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED
}
