// Copies every account that ticked "Send me news..." into the subscribers list in Resend:
// `npm run subscribers:sync`. New sign-ups are added automatically (src/auth.js), so you only need this
// once at the start, or if adding someone ever failed. Safe to run again: people already on the list are skipped.
//
// The first time (when RESEND_SEGMENT_ID isn't set yet) it creates the list in Resend and prints its id.
// Put that id in server/.env and on Railway as RESEND_SEGMENT_ID.
import './use-direct-connection.js' // Must be first: use Neon's direct (unpooled) address for this script.
import { pool } from '../src/db.js'
import { RESEND_SEGMENT_ID } from '../src/config.js'
import { addSubscriberToList, resend } from '../src/email.js'

if (!resend) throw new Error('Set RESEND_API_KEY in server/.env first (a Full access key).')

let segmentId = RESEND_SEGMENT_ID
if (!segmentId) {
  const { data, error } = await resend.segments.create({ name: 'Aurora Photography subscribers' })
  if (error) throw new Error(`Could not create the list in Resend: ${error.message}`)
  segmentId = data.id
  console.log(`Created the "Aurora Photography subscribers" list in Resend.\n  Add this line to server/.env (and Railway):  RESEND_SEGMENT_ID=${segmentId}\n`)
}

const { rows } = await pool.query('SELECT name, email FROM "user" WHERE "marketingOptIn" = true ORDER BY "createdAt"')
for (const user of rows) {
  console.log(`  ${user.email}: ${await addSubscriberToList(user, { segmentId })}`)
}
console.log(`${rows.length} opted-in account(s) checked.`)
await pool.end()
