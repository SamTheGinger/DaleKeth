// The three forms on the site now save to the database instead of only showing a thank-you message.
// Visitors don't have to be signed in; when they are, the request is linked to their account.
//   POST /api/artworks/:id/purchase-requests  { quantity, name, email }
//   POST /api/events/:id/bookings             { spots, name, email, phone }  (takes the spots off the event)
//   POST /api/photoshoot-bookings             { name, email, phone, style }
import { Router } from 'express'
import { optionalUser } from '../auth.js'
import { query, transaction } from '../db.js'
import { HttpError, email, parseId, text, wholeNumber } from '../validate.js'

const router = Router()
router.use(optionalUser)

const MAX_SPOTS_PER_BOOKING = 10 // Matches the limit on the event page.

router.post('/artworks/:id/purchase-requests', async (req, res) => {
  const artworkId = parseId(req.params.id)
  const [artwork] = await query('SELECT available FROM artworks WHERE id = $1', [artworkId])
  if (!artwork) throw new HttpError(404, 'Not found.')
  if (artwork.available === 0) throw new HttpError(409, 'Sorry, this piece has sold out.')

  const quantity = wholeNumber(req.body.quantity, 'Quantity', { min: 1, max: artwork.available })
  const [request] = await query(
    `INSERT INTO purchase_requests (artwork_id, user_id, quantity, name, email)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
    [artworkId, req.user?.id ?? null, quantity, text(req.body.name, 'Name'), email(req.body.email)],
  )
  res.status(201).json(request) // 201 = "created".
})

router.post('/events/:id/bookings', async (req, res) => {
  const eventId = parseId(req.params.id)
  const spots = wholeNumber(req.body.spots, 'Spots', { min: 1, max: MAX_SPOTS_PER_BOOKING })
  const details = [text(req.body.name, 'Name'), email(req.body.email), text(req.body.phone, 'Phone number', 30)]

  const booking = await transaction(async (client) => {
    // Take the spots off in ONE statement that also checks there are enough left.
    // Two people booking the last spot at the same moment can't both succeed: Postgres runs
    // these updates one after the other, and the second finds "spots >= $1" is no longer true.
    const updated = await client.query(
      'UPDATE events SET spots = spots - $1 WHERE id = $2 AND spots >= $1 RETURNING spots',
      [spots, eventId],
    )
    if (updated.rowCount === 0) {
      const exists = await client.query('SELECT spots FROM events WHERE id = $1', [eventId])
      if (exists.rowCount === 0) throw new HttpError(404, 'Not found.')
      throw new HttpError(409, `Sorry, only ${exists.rows[0].spots} spots are left.`)
    }
    const inserted = await client.query(
      `INSERT INTO event_bookings (event_id, user_id, spots, name, email, phone)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [eventId, req.user?.id ?? null, spots, ...details],
    )
    return { ...inserted.rows[0], spotsLeft: updated.rows[0].spots }
  })
  res.status(201).json(booking)
})

router.post('/photoshoot-bookings', async (req, res) => {
  const style = req.body.style
  if (style !== 'landscape' && style !== 'portrait') throw new HttpError(400, 'Please choose a photoshoot style.')

  const [booking] = await query(
    `INSERT INTO photoshoot_bookings (user_id, name, email, phone, style)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
    [req.user?.id ?? null, text(req.body.name, 'Name'), email(req.body.email), text(req.body.phone, 'Phone number', 30), style],
  )
  res.status(201).json(booking)
})

export default router
