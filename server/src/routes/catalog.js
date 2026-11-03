// Public, read-only catalogue.
//   GET /api/photos[/:id]     portfolio series, each with its ordered gallery
//   GET /api/artworks[/:id]
//   GET /api/events[/:id]     the list endpoint returns upcoming events only, soonest first
import { Router } from 'express'
import { query } from '../db.js'
import { HttpError, parseId } from '../validate.js'

const router = Router()

const PHOTOS_SQL = `
  SELECT p.id, p.title, p.category, p.src,
         COALESCE(json_agg(i.src ORDER BY i.position) FILTER (WHERE i.id IS NOT NULL), '[]') AS gallery
  FROM photos p
  LEFT JOIN photo_images i ON i.photo_id = p.id`

// Dates are returned as 'YYYY-MM-DD' strings; letting pg build a JS Date would apply the server's
// time zone and can shift the day.
const EVENT_COLUMNS = `id, title, to_char(date, 'YYYY-MM-DD') AS date, time, venue, price, spots, src, description`

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
