// The signed-in user's marketing-email subscription.
//   GET    /api/subscription  -> { subscribed, changed }   changed: the account was just reconciled with Resend
//   POST   /api/subscription  -> { subscribed: true }
//   DELETE /api/subscription  -> { subscribed: false }
//
// Emails are awaited before responding because serverless functions may be frozen once the response
// is sent. Email failures are logged and never fail the request.
import { Router } from 'express'
import { requireUser } from '../auth.js'
import { query } from '../db.js'
import { addSubscriberToList, hasUnsubscribedInResend, sendMarketingOptInEmail, sendUnsubscribedEmail, unsubscribeInResend } from '../email.js'

const router = Router()
router.use(requireUser)

router.get('/', async (req, res) => {
  const [row] = await query('SELECT "marketingOptIn" FROM "user" WHERE id = $1', [req.user.id])
  let subscribed = Boolean(row?.marketingOptIn)
  let changed = false

  // Fallback for a missed Resend webhook: if they unsubscribed via an email link, reconcile now.
  if (subscribed && (await hasUnsubscribedInResend(req.user.email)) === true) {
    await query('UPDATE "user" SET "marketingOptIn" = false WHERE id = $1', [req.user.id])
    subscribed = false
    changed = true
  }
  res.json({ subscribed, changed })
})

router.post('/', async (req, res) => {
  const changed = await query(
    'UPDATE "user" SET "marketingOptIn" = true, "updatedAt" = now() WHERE id = $1 AND "marketingOptIn" = false RETURNING id',
    [req.user.id],
  )

  // An explicit opt-in from the user is the only case where a previous Resend unsubscribe is overridden.
  await addSubscriberToList(req.user, { resubscribe: true })

  if (changed.length > 0) {
    await sendMarketingOptInEmail(req.user, { via: 'button' }).catch((error) => console.error('Marketing opt-in email failed:', error.message))
  }
  res.json({ subscribed: true })
})

router.delete('/', async (req, res) => {
  // Update our database before Resend: Resend's resulting contact.updated webhook then finds the account
  // already unsubscribed and doesn't send a duplicate confirmation (see routes/resendWebhook.js).
  const changed = await query(
    'UPDATE "user" SET "marketingOptIn" = false, "updatedAt" = now() WHERE id = $1 AND "marketingOptIn" = true RETURNING id',
    [req.user.id],
  )
  await unsubscribeInResend(req.user.email)

  if (changed.length > 0) {
    await sendUnsubscribedEmail(req.user).catch((error) => console.error('Unsubscribe confirmation failed:', error.message))
  }
  res.json({ subscribed: false })
})

export default router
