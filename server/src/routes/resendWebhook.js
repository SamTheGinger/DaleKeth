// Resend calls this address (a "webhook") whenever a contact on the subscribers list changes, including when
// someone clicks the unsubscribe link at the bottom of one of the bulk emails (Broadcasts).
//   POST /api/webhooks/resend   (set up once in Resend → Webhooks, event "contact.updated")
//
// When it says someone has unsubscribed, we update their account and email them a confirmation with a
// "Subscribe again" button, the same email they'd get for unsubscribing on the website.
import { RESEND_WEBHOOK_SECRET } from '../config.js'
import { query } from '../db.js'
import { resend, sendUnsubscribedEmail } from '../email.js'

// Used in app.js with express.raw(), because checking the signature needs the request body exactly as it arrived.
export async function handleResendWebhook(req, res) {
  if (!resend || !RESEND_WEBHOOK_SECRET) return res.status(503).json({ error: 'Webhook not set up.' })

  // Anyone on the internet could call this address, so first check the message really came from Resend:
  // it's signed with a secret only Resend and our server know. verify() throws if the signature is wrong.
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
    // Only if their account still says "subscribed". If it already says unsubscribed, they did it on the website,
    // which has already sent the confirmation (routes/subscription.js), so we don't send a second one.
    const [user] = await query(
      `UPDATE "user" SET "marketingOptIn" = false, "updatedAt" = now()
       WHERE lower(email) = lower($1) AND "marketingOptIn" = true RETURNING name, email`,
      [event.data.email],
    )
    if (user) await sendUnsubscribedEmail(user)
  }

  // 200 = "got it". Anything else makes Resend try again later.
  res.json({ received: true })
}
