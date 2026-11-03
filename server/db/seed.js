// npm run db:seed — upserts catalogue content from db/seed-data/. Run db:migrate first.
// Idempotent: rows are matched by id and updated. Stock columns (artworks.available, events.spots)
// are only set on first insert, so re-seeding never undoes real bookings.
import './use-direct-connection.js'
import { transaction, pool } from '../src/db.js'
import photos from './seed-data/photos.js'
import artworks from './seed-data/artworks.js'
import events from './seed-data/events.js'

// Explicit ids keep URLs like #/gallery/3 stable, but bypass the identity sequence; advance it past the max id.
async function resetIdSequence(client, table) {
  await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT max(id) FROM ${table}))`)
}

await transaction(async (client) => {
  for (const photo of photos) {
    await client.query(
      `INSERT INTO photos (id, title, category, src) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category, src = EXCLUDED.src`,
      [photo.id, photo.title, photo.category, photo.src],
    )
    await client.query('DELETE FROM photo_images WHERE photo_id = $1', [photo.id])
    for (const [position, src] of photo.gallery.entries()) {
      await client.query('INSERT INTO photo_images (photo_id, position, src) VALUES ($1, $2, $3)', [photo.id, position, src])
    }
  }
  await resetIdSequence(client, 'photos')

  for (const a of artworks) {
    await client.query(
      `INSERT INTO artworks (id, title, medium, size, price, available, src, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, medium = EXCLUDED.medium, size = EXCLUDED.size,
         price = EXCLUDED.price, src = EXCLUDED.src, description = EXCLUDED.description`,
      [a.id, a.title, a.medium, a.size, a.price, a.available, a.src, a.description],
    )
  }
  await resetIdSequence(client, 'artworks')

  for (const e of events) {
    await client.query(
      `INSERT INTO events (id, title, date, time, venue, price, spots, src, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, date = EXCLUDED.date, time = EXCLUDED.time,
         venue = EXCLUDED.venue, price = EXCLUDED.price, src = EXCLUDED.src, description = EXCLUDED.description`,
      [e.id, e.title, e.date, e.time, e.venue, e.price, e.spots, e.src, e.description],
    )
  }
  await resetIdSequence(client, 'events')
})

console.log(`Seeded ${photos.length} photo series, ${artworks.length} artworks and ${events.length} events.`)
await pool.end()
