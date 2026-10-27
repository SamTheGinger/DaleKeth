// Stripe calls this address (a "webhook") when something happens to a Checkout Session.
//   POST /api/webhooks/stripe
//   Locally:     stripe listen --forward-to localhost:3000/api/webhooks/stripe
//   Production:  an endpoint in Stripe (Developers → Webhooks) pointing at the live API, with the events
//                checkout.session.completed, checkout.session.async_payment_succeeded and checkout.session.expired.
//
// This is the ONLY code that marks an order as 'paid'. It's also where the artwork's stock goes down,
// so a piece is only taken off the shelf once it has really been paid for.
import { STRIPE_WEBHOOK_SECRET } from '../config.js'
import { query, transaction } from '../db.js'
import { stripe } from '../stripe.js'

// Marks the order as paid and takes the pieces off the stock, all in one transaction.
async function markOrderPaid(orderId, sessionId) {
  await transaction(async (client) => {
    // "AND status = 'pending'": Stripe can send the same event more than once. The second time, nothing matches,
    // so the stock isn't taken off twice. "AND stripe_session_id" makes sure this session really is that order's.
    const paid = await client.query(
      `UPDATE orders SET status = 'paid', paid_at = now() WHERE id = $1 AND stripe_session_id = $2 AND status = 'pending' RETURNING id`,
      [orderId, sessionId],
    )
    if (paid.rowCount === 0) return

    const { rows: items } = await client.query('SELECT artwork_id, quantity FROM order_items WHERE order_id = $1', [orderId])
    for (const item of items) {
      const updated = await client.query('UPDATE artworks SET available = available - $1 WHERE id = $2 AND available >= $1', [
        item.quantity,
        item.artwork_id,
      ])
      // Two people paid for the last piece at the same moment. The money has been taken, so the order stays paid;
      // this message in the logs says it needs sorting out by hand (a refund from the Stripe dashboard).
      if (updated.rowCount === 0) console.warn(`Order ${orderId} is paid, but artwork ${item.artwork_id} doesn't have enough left.`)
    }
    console.log(`Order ${orderId} paid.`)
  })
}

// Used in app.js with express.raw(), because checking the signature needs the request body exactly as it arrived.
export async function handleStripeWebhook(req, res) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'Webhook not set up.' })

  // Anyone could send a fake "payment succeeded" message to this address. Stripe signs each real one with
  // the webhook secret, and constructEvent() throws if the signature doesn't match.
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, req.get('stripe-signature'), STRIPE_WEBHOOK_SECRET)
  } catch {
    return res.status(400).json({ error: 'Invalid signature.' })
  }

  const session = event.data.object // For checkout.session.* events, this is the Checkout Session.
  const orderId = Number(session.metadata?.orderId) // Put there by routes/orders.js.

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    // "completed" means the buyer finished the form. For cards the money is in straight away (payment_status 'paid');
    // slower payment methods send async_payment_succeeded later, which this also handles.
    if (session.payment_status === 'paid' && orderId) await markOrderPaid(orderId, session.id)
  } else if (event.type === 'checkout.session.expired') {
    // They never paid (Stripe closes an unused checkout after 24 hours).
    await query(`UPDATE orders SET status = 'expired' WHERE id = $1 AND stripe_session_id = $2 AND status = 'pending'`, [orderId, session.id])
  }

  // Answer 200 quickly, so Stripe knows it arrived. If anything above threw, Express answers 500 instead and
  // Stripe tries again later.
  res.json({ received: true })
}
