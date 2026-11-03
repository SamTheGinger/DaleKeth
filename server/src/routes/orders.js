// Paid event spots via Stripe Checkout. Both routes require a signed-in user.
//   POST /api/checkout     { eventId, spots } -> { url }   creates a pending order and a Checkout Session
//   GET  /api/orders/:id   the caller's own order with its line items
//
// Orders are never marked paid here: reaching the success URL proves nothing. Only the signed
// Stripe webhook (routes/stripeWebhook.js) transitions an order to 'paid'.
import { Router } from 'express'
import { requireUser } from '../auth.js'
import { SITE_URL } from '../config.js'
import { query, transaction } from '../db.js'
import { stripe } from '../stripe.js'
import { HttpError, MAX_SPOTS_PER_BOOKING, parseId, wholeNumber } from '../validate.js'

const router = Router()

router.post('/checkout', requireUser, async (req, res) => {
  if (!stripe) throw new HttpError(503, 'Payments aren’t set up yet. Please try again later.')

  // Price is always read from the database; the client only chooses the event and quantity.
  const [event] = await query(
    `SELECT id, title, price, spots, to_char(date, 'YYYY-MM-DD') AS date FROM events WHERE id = $1 AND date >= CURRENT_DATE`,
    [parseId(req.body.eventId)],
  )
  if (!event) throw new HttpError(404, 'Not found.')
  if (event.price === 0) throw new HttpError(409, 'This event is free, so there’s nothing to pay. Reserve your spot instead.')
  if (event.spots === 0) throw new HttpError(409, 'Sorry, this event is fully booked.')
  const spots = wholeNumber(req.body.spots, 'Spots', { min: 1, max: Math.min(MAX_SPOTS_PER_BOOKING, event.spots) })

  // The Stripe call is inside the transaction so a failure leaves no orphaned pending order.
  const url = await transaction(async (client) => {
    const { rows: [order] } = await client.query('INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id', [
      req.user.id,
      event.price * spots,
    ])
    await client.query('INSERT INTO order_items (order_id, event_id, title, unit_price, quantity) VALUES ($1, $2, $3, $4, $5)', [
      order.id,
      event.id,
      event.title,
      event.price,
      spots,
    ])

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: req.user.email,
      metadata: { orderId: String(order.id) },
      line_items: [
        {
          quantity: spots,
          price_data: {
            currency: 'zar',
            unit_amount: event.price * 100, // Stripe amounts are in cents.
            product_data: { name: `${event.title}: 1 spot`, description: `Event on ${event.date}` },
          },
        },
      ],
      success_url: `${SITE_URL}/#/order/${order.id}`,
      cancel_url: `${SITE_URL}/#/event/${event.id}`,
    })

    await client.query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, order.id])
    return session.url
  })

  res.status(201).json({ url })
})

router.get('/orders/:id', requireUser, async (req, res) => {
  // Scoped to the caller: another user's order id returns 404, not 403, to avoid revealing it exists.
  const [order] = await query(
    `SELECT id, status, total, currency, to_char(created_at, 'YYYY-MM-DD') AS date FROM orders WHERE id = $1 AND user_id = $2`,
    [parseId(req.params.id), req.user.id],
  )
  if (!order) throw new HttpError(404, 'Not found.')

  const items = await query(
    'SELECT event_id AS "eventId", title, unit_price AS "unitPrice", quantity FROM order_items WHERE order_id = $1 ORDER BY id',
    [order.id],
  )
  res.json({ ...order, items })
})

export default router
