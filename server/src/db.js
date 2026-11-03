import pg from 'pg'
import { DATABASE_URL } from './config.js'

export const pool = new pg.Pool({ connectionString: DATABASE_URL })

// Runs a parameterised query and returns its rows.
export async function query(text, values) {
  const result = await pool.query(text, values)
  return result.rows
}

// Runs `work(client)` inside a transaction, rolling back if it throws.
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
    client.release()
  }
}
