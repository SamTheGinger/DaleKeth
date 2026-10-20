// One shared connection pool to Postgres. A pool keeps a few connections open and lends them out,
// so each request doesn't pay the cost of connecting to Neon from scratch.
import pg from 'pg'
import { DATABASE_URL } from './config.js'

export const pool = new pg.Pool({ connectionString: DATABASE_URL })

// A shortcut: query('SELECT ... WHERE id = $1', [id]) -> the result rows.
// Values go in the [ ] list, never pasted into the SQL text, which protects against SQL injection.
export async function query(text, values) {
  const result = await pool.query(text, values)
  return result.rows
}

// Runs several queries as one all-or-nothing transaction. If anything inside throws, every change is undone.
export async function transaction(work) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release() // Give the connection back to the pool.
  }
}
