// Buying spots for a paid event with Stripe Checkout. Both routes need someone signed in (requireUser), so every
// order belongs to a real account. (Free events are reserved without paying: see routes/bookings.js.)
//   POST /api/checkout     { eventId, spots }  -> { url }  Creates a 'pending' order and a Stripe Checkout Session;
//                                                         the browser then goes to url (Stripe's payment page).
//   GET  /api/orders/:id   -> the order with its items. Only the person who made it can see it.
//
// The order is NOT marked as paid here. Being sent back to the success page doesn't prove anything (anyone can
// type that address), so only Stripe's webhook (stripeWebhook.js) may change an order to 'paid'.
import { Router } from 'express'
import { requireUser } from '../auth.js'
import { SITE_URL } from '../config.js'
import { query, transaction } from '../db.js'
import { stripe } from '../stripe.js'
import { HttpError, parseId, wholeNumber } from '../validate.js'

const router = Router()

const MAX_SPOTS_PER_ORDER = 10 // Matches the limit on the event page.

router.post('/checkout', requireUser, async (req, res) => {
  if (!stripe) throw new HttpError(503, 'Payments aren’t set up yet. Please try again later.')

  // The price comes from OUR database, never from the browser: anyone could send { price: 1 } to this address.
  // The browser only says WHICH event and HOW MANY spots. "date >= CURRENT_DATE" = past events can't be bought.
  const [event] = await query(
    `SELECT id, title, price, spots, to_char(date, 'YYYY-MM-DD') AS date FROM events WHERE id = $1 AND date >= CURRENT_DATE`,
    [parseId(req.body.eventId)],
  )
  if (!event) throw new HttpError(404, 'Not found.')
  if (event.price === 0) throw new HttpError(409, 'This event is free, so there’s nothing to pay. Reserve your spot instead.')
  if (event.spots === 0) throw new HttpError(409, 'Sorry, this event is fully booked.')
  const spots = wholeNumber(req.body.spots, 'Spots', { min: 1, max: Math.min(MAX_SPOTS_PER_ORDER, event.spots) })

  // All or nothing: if Stripe fails, the transaction is undone and no half-made order is left behind.
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
      mode: 'payment', // A one-off payment (not a subscription).
      customer_email: req.user.email, // Fills in the email box on Stripe's page.
      metadata: { orderId: String(order.id) }, // Stripe sends this back in the webhook, so we know which order was paid.
      line_items: [
        {
          quantity: spots,
          price_data: {
            currency: 'zar',
            unit_amount: event.price * 100, // Stripe counts in cents: R 250 = 25000.
            product_data: { name: `${event.title}: 1 spot`, description: `Event on ${event.date}` },
          },
        },
      ],
      // Where Stripe sends the buyer afterwards: our order page (OrderPage.jsx), or back to the event if they cancel.
      success_url: `${SITE_URL}/#/order/${order.id}`,
      cancel_url: `${SITE_URL}/#/event/${event.id}`,
    })

    await client.query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, order.id])
    return session.url // Stripe's hosted checkout page for this session.
  })

  res.status(201).json({ url })
})

router.get('/orders/:id', requireUser, async (req, res) => {
  // "AND user_id = $2": someone else's order number answers 404, as if it didn't exist.
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
