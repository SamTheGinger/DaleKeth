// Copies the site's content from db/seed-data/ (the lists that used to be hardcoded in the React app)
// into the database: `npm run db:seed`. Run db:migrate first.
//
// It's safe to run again after editing the seed files: rows are matched by id and updated.
// Stock (artwork "available" and event "spots") is only set when a row is first created, so
// re-seeding never undoes bookings that real visitors have made.
import './use-direct-connection.js' // Must be first: use Neon's direct (unpooled) address for this script.
import { transaction, pool } from '../src/db.js'
import photos from './seed-data/photos.js'
import artworks from './seed-data/artworks.js'
import events from './seed-data/events.js'
import testimonials from './seed-data/testimonials.js'

// A few paths in photos.js were missing their leading slash ('Images/...'), which only worked
// on the home page. Fix them on the way in so every path is '/Images/...'.
const withSlash = (src) => (src.startsWith('/') ? src : `/${src}`)

// Ids are written explicitly (so links like #/gallery/3 keep working), which leaves Postgres's
// automatic id counter behind. This moves the counter past the highest id so new rows don't clash.
async function resetIdCounter(client, table) {
  await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT max(id) FROM ${table}))`)
}

await transaction(async (client) => {
  for (const photo of photos) {
    await client.query(
      `INSERT INTO photos (id, title, category, src) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category, src = EXCLUDED.src`,
      [photo.id, photo.title, photo.category, withSlash(photo.src)],
    )
    // Replace this series' images with the list from the file, keeping their order.
    await client.query('DELETE FROM photo_images WHERE photo_id = $1', [photo.id])
    for (const [position, src] of photo.gallery.entries()) {
      await client.query('INSERT INTO photo_images (photo_id, position, src) VALUES ($1, $2, $3)', [
        photo.id,
        position,
        withSlash(src),
      ])
    }
  }
  await resetIdCounter(client, 'photos')

  for (const a of artworks) {
    await client.query(
      `INSERT INTO artworks (id, title, medium, size, price, available, src, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, medium = EXCLUDED.medium, size = EXCLUDED.size,
         price = EXCLUDED.price, src = EXCLUDED.src, description = EXCLUDED.description`,
      [a.id, a.title, a.medium, a.size, a.price, a.available, a.src, a.description],
    )
  }
  await resetIdCounter(client, 'artworks')

  for (const e of events) {
    await client.query(
      `INSERT INTO events (id, title, date, time, venue, price, spots, src, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, date = EXCLUDED.date, time = EXCLUDED.time,
         venue = EXCLUDED.venue, price = EXCLUDED.price, src = EXCLUDED.src, description = EXCLUDED.description`,
      [e.id, e.title, e.date, e.time, e.venue, e.price, e.spots, e.src, e.description],
    )
  }
  await resetIdCounter(client, 'events')

  for (const t of testimonials) {
    await client.query(
      `INSERT INTO testimonials (id, name, rating, message, created_at, approved) VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, rating = EXCLUDED.rating, message = EXCLUDED.message,
         created_at = EXCLUDED.created_at, approved = true`,
      [t.id, t.name, t.rating, t.message, t.createdAt],
    )
  }
  await resetIdCounter(client, 'testimonials')
})

console.log(
  `Seeded ${photos.length} photo series, ${artworks.length} artworks, ${events.length} events and ${testimonials.length} testimonials.`,
)
await pool.end()
