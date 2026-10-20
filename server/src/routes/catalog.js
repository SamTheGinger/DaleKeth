// Public, read-only routes for the site's content. Anyone can call these; no sign-in needed.
//   GET /api/photos          every portfolio series, each with its gallery images
//   GET /api/photos/:id      one series
//   GET /api/artworks        every artwork in the shop
//   GET /api/artworks/:id
//   GET /api/events          upcoming events, soonest first
//   GET /api/events/:id
import { Router } from 'express'
import { query } from '../db.js'
import { HttpError, parseId } from '../validate.js'

const router = Router()

// json_agg gathers each photo's images into one list, so the reply has the same shape as the old
// photos.js: { id, title, category, src, gallery: ['/Images/...', ...] }.
const PHOTOS_SQL = `
  SELECT p.id, p.title, p.category, p.src,
         COALESCE(json_agg(i.src ORDER BY i.position) FILTER (WHERE i.id IS NOT NULL), '[]') AS gallery
  FROM photos p
  LEFT JOIN photo_images i ON i.photo_id = p.id`

// to_char sends the date as plain '2026-11-21' text. Without it, pg would turn it into a JavaScript Date
// at midnight in the server's time zone, which can show up as the day before.
const EVENT_COLUMNS = `id, title, to_char(date, 'YYYY-MM-DD') AS date, time, venue, price, spots, src, description`

// Answers with the single row, or a 404 when the list is empty.
function one(rows) {
  if (rows.length === 0) throw new HttpError(404, 'Not found.')
  return rows[0]
}

router.get('/photos', async (req, res) => {
  res.json(await query(`${PHOTOS_SQL} GROUP BY p.id ORDER BY p.id`))
})

router.get('/photos/:id', async (req, res) => {
  res.json(one(await query(`${PHOTOS_SQL} WHERE p.id = $1 GROUP BY p.id`, [parseId(req.params.id)])))
})

router.get('/artworks', async (req, res) => {
  res.json(await query('SELECT * FROM artworks ORDER BY id'))
})

router.get('/artworks/:id', async (req, res) => {
  res.json(one(await query('SELECT * FROM artworks WHERE id = $1', [parseId(req.params.id)])))
})

router.get('/events', async (req, res) => {
  res.json(await query(`SELECT ${EVENT_COLUMNS} FROM events WHERE date >= CURRENT_DATE ORDER BY date`))
})

router.get('/events/:id', async (req, res) => {
  res.json(one(await query(`SELECT ${EVENT_COLUMNS} FROM events WHERE id = $1`, [parseId(req.params.id)])))
})

export default router
