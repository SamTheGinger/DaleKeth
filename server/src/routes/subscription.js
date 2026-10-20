// The signed-in person's email subscription. Used by the "Stay In The Loop" section at the bottom of the
// home page and by the "Your Subscription" page (#/subscription).
//   GET    /api/subscription  -> { subscribed, changed }  Are they getting the emails?
//                                                        changed = true if we just updated their account (see below).
//   POST   /api/subscription  -> { subscribed: true }     Subscribe them.
//   DELETE /api/subscription  -> { subscribed: false }    Unsubscribe them (and email them a confirmation).
import { Router } from 'express'
import { requireUser } from '../auth.js'
import { query } from '../db.js'
import { addSubscriberToList, hasUnsubscribedInResend, sendMarketingOptInEmail, sendUnsubscribedEmail, unsubscribeInResend } from '../email.js'

const router = Router()
router.use(requireUser) // Every route here needs someone signed in (req.user).

router.get('/', async (req, res) => {
  const [row] = await query('SELECT "marketingOptIn" FROM "user" WHERE id = $1', [req.user.id])
  let subscribed = Boolean(row?.marketingOptIn)
  let changed = false

  // A back-up check: if they unsubscribed with the link in one of the emails and the webhook from Resend
  // didn't reach us (routes/resendWebhook.js), catch up now so the site doesn't say "You're subscribed".
  if (subscribed && (await hasUnsubscribedInResend(req.user.email)) === true) {
    await query('UPDATE "user" SET "marketingOptIn" = false WHERE id = $1', [req.user.id])
    subscribed = false
    changed = true // Tells the website to refresh the session, so the header catches up too.
  }
  res.json({ subscribed, changed })
})

router.post('/', async (req, res) => {
  // Only changes anything if they weren't subscribed already; RETURNING tells us whether it did.
  const changed = await query(
    'UPDATE "user" SET "marketingOptIn" = true, "updatedAt" = now() WHERE id = $1 AND "marketingOptIn" = false RETURNING id',
    [req.user.id],
  )

  // This person just asked for the emails themselves, so it's fine to re-subscribe them in Resend
  // even if they unsubscribed through an email link before (resubscribe: true).
  await addSubscriberToList(req.user, { resubscribe: true })

  // Tell the photographer, but only the first time (not if they click Subscribe twice).
  // No "await": the visitor gets their answer straight away; a failed email is only logged.
  if (changed.length > 0) {
    sendMarketingOptInEmail(req.user, { via: 'button' }).catch((error) => console.error('Marketing opt-in email failed:', error.message))
  }
  res.json({ subscribed: true })
})

router.delete('/', async (req, res) => {
  // 1. Our database first. The order matters: step 2 makes Resend call our webhook, which sees the account is
  //    already unsubscribed here and so doesn't send a second confirmation email.
  const changed = await query(
    'UPDATE "user" SET "marketingOptIn" = false, "updatedAt" = now() WHERE id = $1 AND "marketingOptIn" = true RETURNING id',
    [req.user.id],
  )
  // 2. Resend, so no more bulk emails go to them.
  await unsubscribeInResend(req.user.email)
  // 3. Confirm by email (with a "Subscribe again" button), only if they were actually subscribed.
  if (changed.length > 0) {
    sendUnsubscribedEmail(req.user).catch((error) => console.error('Unsubscribe confirmation failed:', error.message))
  }
  res.json({ subscribed: false })
})

export default router
