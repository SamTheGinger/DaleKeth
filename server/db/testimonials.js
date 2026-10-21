// Approve (or delete) the reviews visitors leave in the Testimonials section. Run in the server folder:
//   npm run testimonials                    lists the reviews waiting for approval
//   npm run testimonials -- approve 7       shows review 7 on the site
//   npm run testimonials -- delete 7        removes review 7 for good
// (The "--" passes the words after it to this script instead of to npm.)
import './use-direct-connection.js' // Must be first: use Neon's direct (unpooled) address for this script.
import { pool, query } from '../src/db.js'

const [action, idText] = process.argv.slice(2) // process.argv = the words typed after "node db/testimonials.js".
const id = Number(idText)

if (!action) {
  const waiting = await query(
    `SELECT t.id, t.name, u.email, t.rating, t.message, to_char(t.created_at, 'YYYY-MM-DD') AS date
     FROM testimonials t LEFT JOIN "user" u ON u.id = t.user_id
     WHERE NOT t.approved ORDER BY t.created_at`,
  )
  if (waiting.length === 0) console.log('No reviews are waiting for approval.')
  for (const t of waiting) {
    console.log(`#${t.id}  ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}  ${t.name} <${t.email ?? 'no account'}>  ${t.date}`)
    console.log(`     "${t.message}"\n`)
  }
  if (waiting.length) console.log('Approve one with: npm run testimonials -- approve <number>   (or delete <number>)')
} else if ((action === 'approve' || action === 'delete') && Number.isInteger(id)) {
  const sql =
    action === 'approve'
      ? 'UPDATE testimonials SET approved = true WHERE id = $1 RETURNING name'
      : 'DELETE FROM testimonials WHERE id = $1 RETURNING name'
  const [row] = await query(sql, [id])
  console.log(row ? `Review #${id} by ${row.name} ${action === 'approve' ? 'is now on the site' : 'was deleted'}.` : `There is no review #${id}.`)
} else {
  console.log('Usage: npm run testimonials   |   npm run testimonials -- approve <number>   |   npm run testimonials -- delete <number>')
  process.exitCode = 1
}

await pool.end() // Close the connections so the script can finish.
