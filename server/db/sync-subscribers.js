// npm run subscribers:sync — backfills every opted-in account into the Resend subscribers segment.
// New opt-ins are added automatically (src/auth.js), so this is only needed for initial setup or recovery.
// If RESEND_SEGMENT_ID is unset, the segment is created and its id printed for you to add to the environment.
import './use-direct-connection.js'
import { pool } from '../src/db.js'
import { RESEND_SEGMENT_ID } from '../src/config.js'
import { addSubscriberToList, resend } from '../src/email.js'

if (!resend) throw new Error('Set RESEND_API_KEY (a full-access key) in server/.env first.')

let segmentId = RESEND_SEGMENT_ID
if (!segmentId) {
  const { data, error } = await resend.segments.create({ name: 'Aurora Photography subscribers' })
  if (error) throw new Error(`Could not create the segment in Resend: ${error.message}`)
  segmentId = data.id
  console.log(`Created the "Aurora Photography subscribers" segment.\n  Set RESEND_SEGMENT_ID=${segmentId} in server/.env and on Vercel.\n`)
}

const { rows } = await pool.query('SELECT name, email FROM "user" WHERE "marketingOptIn" = true ORDER BY "createdAt"')
for (const user of rows) {
  console.log(`  ${user.email}: ${await addSubscriberToList(user, { segmentId })}`)
}
console.log(`${rows.length} opted-in account(s) checked.`)
await pool.end()
