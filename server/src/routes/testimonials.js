// The Testimonials section: reviews with a 1 to 5 star rating.
// Anyone can read them, but only signed-in accounts can write one. A new review is NOT shown straight away:
// it's saved with approved = false and the photographer is emailed. `npm run testimonials` lists the waiting
// reviews and approves (or deletes) them; only approved reviews are sent to the site.
//   GET  /api/testimonials   { average, count, testimonials: [the newest few approved] }
//   POST /api/testimonials   { rating, message }   (signed in; the name comes from their account)
import { Router } from 'express'
import { requireUser } from '../auth.js'
import { query } from '../db.js'
import { sendNewTestimonialEmail } from '../email.js'
import { HttpError, text, wholeNumber } from '../validate.js'

const router = Router()

const SHOWN = 6 // How many reviews the section shows.

// to_char sends the date as plain '2026-09-14' text (see EVENT_COLUMNS in catalog.js for why).
const COLUMNS = `id, name, rating, message, to_char(created_at, 'YYYY-MM-DD') AS date`

router.get('/', async (req, res) => {
  // The average and count cover every approved review, not only the ones shown.
  // ::float turns Postgres's exact decimal (which pg sends as text) into a normal number.
  const [[stats], testimonials] = await Promise.all([
    query('SELECT count(*)::int AS count, coalesce(avg(rating), 0)::float AS average FROM testimonials WHERE approved'),
    query(`SELECT ${COLUMNS} FROM testimonials WHERE approved ORDER BY created_at DESC, id DESC LIMIT $1`, [SHOWN]),
  ])
  res.json({ ...stats, testimonials })
})

router.post('/', requireUser, async (req, res) => {
  const rating = wholeNumber(req.body.rating, 'Rating', { min: 1, max: 5 })
  const message = text(req.body.message, 'Your review', 600)

  // One review waiting for approval per account at a time, so nobody can flood the approval list.
  const [waiting] = await query('SELECT 1 FROM testimonials WHERE user_id = $1 AND NOT approved', [req.user.id])
  if (waiting) throw new HttpError(409, 'Thanks! Your last review is still waiting to be approved.')

  const [testimonial] = await query(
    `INSERT INTO testimonials (user_id, name, rating, message) VALUES ($1, $2, $3, $4) RETURNING ${COLUMNS}`,
    [req.user.id, req.user.name, rating, message],
  )
  // No "await": the visitor gets their answer straight away; a failed email is only logged.
  sendNewTestimonialEmail(req.user, testimonial).catch((error) => console.error('New testimonial email failed:', error.message))
  res.status(201).json(testimonial)
})

export default router
