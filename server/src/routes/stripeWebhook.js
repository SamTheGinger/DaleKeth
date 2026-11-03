// POST /api/webhooks/stripe
//   Local:       stripe listen --forward-to localhost:3000/api/webhooks/stripe
//   Production:  Stripe → Developers → Webhooks, subscribed to checkout.session.completed,
//                checkout.session.async_payment_succeeded and checkout.session.expired.
//
// The only code path that marks an order 'paid' and decrements event stock. Mounted with
// express.raw() in app.js: signature verification needs the unparsed body.
import { STRIPE_WEBHOOK_SECRET } from '../config.js'
import { query, transaction } from '../db.js'
import { sendNewOrderEmail, sendOrderConfirmationEmail } from '../email.js'
import { stripe } from '../stripe.js'

// Returns true if this call transitioned the order to paid, false if it was already processed.
async function markOrderPaid(orderId, sessionId) {
  return transaction(async (client) => {
    // Stripe delivers events at least once. The `status = 'pending'` guard makes redelivery a no-op,
    // and matching stripe_session_id ensures the session actually belongs to this order.
    const paid = await client.query(
      `UPDATE orders SET status = 'paid', paid_at = now() WHERE id = $1 AND stripe_session_id = $2 AND status = 'pending' RETURNING id`,
      [orderId, sessionId],
    )
    if (paid.rowCount === 0) return false

    const { rows: items } = await client.query('SELECT event_id, quantity FROM order_items WHERE order_id = $1', [orderId])
    for (const item of items) {
      const updated = await client.query('UPDATE events SET spots = spots - $1 WHERE id = $2 AND spots >= $1', [
        item.quantity,
        item.event_id,
      ])
      // Concurrent checkouts can both pay for the last spots. Payment has already been captured, so the
      // order stays paid and the oversell is flagged for a manual refund.
      if (updated.rowCount === 0) console.warn(`Order ${orderId} is paid, but event ${item.event_id} doesn't have enough spots left.`)
    }
    console.log(`Order ${orderId} paid.`)
    return true
  })
}

async function sendOrderEmails(orderId) {
  const [order] = await query(
    'SELECT o.id, o.total, u.name, u.email FROM orders o JOIN "user" u ON u.id = o.user_id WHERE o.id = $1',
    [orderId],
  )
  const items = await query(
    `SELECT i.title, i.quantity, i.unit_price AS "unitPrice", e.id AS "eventId",
            to_char(e.date, 'YYYY-MM-DD') AS date, e.time, e.venue
     FROM order_items i JOIN events e ON e.id = i.event_id WHERE i.order_id = $1 ORDER BY i.id`,
    [orderId],
  )
  const results = await Promise.allSettled([sendOrderConfirmationEmail(order, items), sendNewOrderEmail(order, items)])
  for (const result of results) {
    if (result.status === 'rejected') console.error(`Order ${orderId} email failed:`, result.reason.message)
  }
}

export async function handleStripeWebhook(req, res) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'Webhook not set up.' })

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, req.get('stripe-signature'), STRIPE_WEBHOOK_SECRET)
  } catch {
    return res.status(400).json({ error: 'Invalid signature.' })
  }

  const session = event.data.object
  const orderId = Number(session.metadata?.orderId)

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    // Card payments are 'paid' on completion; delayed methods arrive later via async_payment_succeeded.
    // Emails are sent only by the call that performed the transition, so redeliveries never duplicate them.
    // Email failures are logged, not rethrown: a 500 would make Stripe retry a payment that already succeeded.
    if (session.payment_status === 'paid' && orderId && (await markOrderPaid(orderId, session.id))) {
      await sendOrderEmails(orderId).catch((error) => console.error(`Order ${orderId} emails failed:`, error.message))
    }
  } else if (event.type === 'checkout.session.expired') {
    await query(`UPDATE orders SET status = 'expired' WHERE id = $1 AND stripe_session_id = $2 AND status = 'pending'`, [orderId, session.id])
  }

  // Any thrown error above becomes a 500, which tells Stripe to retry.
  res.json({ received: true })
}
