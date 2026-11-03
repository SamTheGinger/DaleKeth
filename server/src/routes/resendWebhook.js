// POST /api/webhooks/resend  (Resend → Webhooks, event: contact.updated)
// Syncs unsubscribes made via Broadcast email links back to the user's account and sends a confirmation.
// Mounted with express.raw() in app.js: signature verification needs the unparsed body.
import { RESEND_WEBHOOK_SECRET } from '../config.js'
import { query } from '../db.js'
import { resend, sendUnsubscribedEmail } from '../email.js'

export async function handleResendWebhook(req, res) {
  if (!resend || !RESEND_WEBHOOK_SECRET) return res.status(503).json({ error: 'Webhook not set up.' })

  let event
  try {
    event = resend.webhooks.verify({
      payload: req.body.toString('utf8'),
      headers: {
        id: req.get('svix-id') ?? req.get('webhook-id'),
        timestamp: req.get('svix-timestamp') ?? req.get('webhook-timestamp'),
        signature: req.get('svix-signature') ?? req.get('webhook-signature'),
      },
      webhookSecret: RESEND_WEBHOOK_SECRET,
    })
  } catch {
    return res.status(400).json({ error: 'Invalid signature.' })
  }

  if (event.type === 'contact.updated' && event.data.unsubscribed) {
    // The "marketingOptIn = true" guard means unsubscribes initiated on our own site (which update the
    // database first, see routes/subscription.js) don't trigger a second confirmation email.
    const [user] = await query(
      `UPDATE "user" SET "marketingOptIn" = false, "updatedAt" = now()
       WHERE lower(email) = lower($1) AND "marketingOptIn" = true RETURNING name, email`,
      [event.data.email],
    )
    if (user) await sendUnsubscribedEmail(user)
  }

  res.json({ received: true })
}
