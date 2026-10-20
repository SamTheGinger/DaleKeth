// A signed-in user's favourite portfolio series. Every route here needs a session (requireUser),
// and only ever reads or changes the rows of the user making the request.
//   GET    /api/favorites           -> [1, 11]  (the photo ids)
//   PUT    /api/favorites/:photoId  add one   (doing it twice is harmless)
//   DELETE /api/favorites/:photoId  remove one
import { Router } from 'express'
import { requireUser } from '../auth.js'
import { query } from '../db.js'
import { HttpError, parseId } from '../validate.js'

const router = Router()
router.use(requireUser)

router.get('/', async (req, res) => {
  const rows = await query('SELECT photo_id FROM favorites WHERE user_id = $1 ORDER BY created_at', [req.user.id])
  res.json(rows.map((row) => row.photo_id))
})

router.put('/:photoId', async (req, res) => {
  const photoId = parseId(req.params.photoId)
  // INSERT ... SELECT only inserts when the photo exists; ON CONFLICT ignores a favourite that's already there.
  const rows = await query(
    `INSERT INTO favorites (user_id, photo_id) SELECT $1, id FROM photos WHERE id = $2
     ON CONFLICT DO NOTHING RETURNING photo_id`,
    [req.user.id, photoId],
  )
  if (rows.length === 0) {
    const exists = await query('SELECT 1 FROM photos WHERE id = $1', [photoId])
    if (exists.length === 0) throw new HttpError(404, 'Not found.')
  }
  res.status(204).end() // 204 = "done, nothing to send back".
})

router.delete('/:photoId', async (req, res) => {
  await query('DELETE FROM favorites WHERE user_id = $1 AND photo_id = $2', [req.user.id, parseId(req.params.photoId)])
  res.status(204).end()
})

export default router
