// Buying artwork with Stripe Checkout. Both routes need someone signed in (requireUser), so every order
// belongs to a real account.
//   POST /api/checkout     { artworkId, quantity }  -> { url }  Creates a 'pending' order and a Stripe Checkout
//                                                              Session; the browser then goes to url (Stripe's page).
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

router.post('/checkout', requireUser, async (req, res) => {
  if (!stripe) throw new HttpError(503, 'Payments aren’t set up yet. Please try again later.')

  // The price comes from OUR database, never from the browser: anyone could send { price: 1 } to this address.
  // The browser only says WHICH artwork and HOW MANY.
  const [artwork] = await query('SELECT id, title, price, available FROM artworks WHERE id = $1', [parseId(req.body.artworkId)])
  if (!artwork) throw new HttpError(404, 'Not found.')
  if (artwork.available === 0) throw new HttpError(409, 'Sorry, this piece has sold out.')
  const quantity = wholeNumber(req.body.quantity, 'Quantity', { min: 1, max: artwork.available })

  // All or nothing: if Stripe fails, the transaction is undone and no half-made order is left behind.
  const url = await transaction(async (client) => {
    const { rows: [order] } = await client.query('INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id', [
      req.user.id,
      artwork.price * quantity,
    ])
    await client.query('INSERT INTO order_items (order_id, artwork_id, title, unit_price, quantity) VALUES ($1, $2, $3, $4, $5)', [
      order.id,
      artwork.id,
      artwork.title,
      artwork.price,
      quantity,
    ])

    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // A one-off payment (not a subscription).
      customer_email: req.user.email, // Fills in the email box on Stripe's page.
      metadata: { orderId: String(order.id) }, // Stripe sends this back in the webhook, so we know which order was paid.
      line_items: [
        {
          quantity,
          price_data: {
            currency: 'zar',
            unit_amount: artwork.price * 100, // Stripe counts in cents: R 6 500 = 650000.
            product_data: { name: artwork.title },
          },
        },
      ],
      // Where Stripe sends the buyer afterwards: our order page (OrderPage.jsx), or back to the artwork if they cancel.
      success_url: `${SITE_URL}/#/order/${order.id}`,
      cancel_url: `${SITE_URL}/#/artwork/${artwork.id}`,
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
    'SELECT artwork_id AS "artworkId", title, unit_price AS "unitPrice", quantity FROM order_items WHERE order_id = $1 ORDER BY id',
    [order.id],
  )
  res.json({ ...order, items })
})

export default router
