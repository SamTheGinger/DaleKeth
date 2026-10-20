// Neon gives two addresses for the same database (`neon env pull` writes both to .env):
//   DATABASE_URL           pooled (host ends in -pooler): many short queries from the running app.
//   DATABASE_URL_UNPOOLED  direct: schema changes and admin scripts. The pooler shares connections
//                          between clients, which can break CREATE TABLE / setval and other session work.
// migrate.js and seed.js import this file FIRST, so the pool in src/db.js is created with the direct address.
// (If there's no DATABASE_URL_UNPOOLED, e.g. a non-Neon database, the normal DATABASE_URL is used.)
import 'dotenv/config'

if (process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED
}
