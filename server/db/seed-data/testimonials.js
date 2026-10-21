// The six sample reviews the Testimonials section starts with (the names are made up).
// Seed data: `npm run db:seed` copies this list into the testimonials table, and the site reads it from GET /api/testimonials.
// Reviews visitors write on the site are added to the same table, so re-seeding never removes them.
// These six are marked as approved when seeded; visitors' reviews wait for approval (`npm run testimonials`).
//
//   id         a unique number.
//   name       who wrote it.
//   rating     1 to 5 stars.
//   message    the review itself.
//   createdAt  when it was written. The section shows the newest first.
const testimonials = [
  {
    id: 1,
    name: 'Lerato Mokoena',
    rating: 5,
    message:
      'Our family portraits are the most beautiful photos we own. She made my two restless boys sit still and smile, which I honestly thought was impossible.',
    createdAt: '2026-04-12',
  },
  {
    id: 2,
    name: 'Daniel van der Merwe',
    rating: 5,
    message:
      'I bought the charcoal piece “Defiance” for my study and it stops every guest in their tracks. Even better in person than on the website.',
    createdAt: '2026-05-03',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    rating: 4,
    message:
      'A calm, relaxed headshot session with lovely natural light. The photos came back a few days later than promised, but they were worth the wait.',
    createdAt: '2026-06-18',
  },
  {
    id: 4,
    name: 'Johan Pretorius',
    rating: 5,
    message:
      'The landscape shoot along the coast was an adventure. She knew exactly where the light would fall at sunrise, and the prints now hang in our lodge.',
    createdAt: '2026-07-22',
  },
  {
    id: 5,
    name: 'Naledi Khumalo',
    rating: 5,
    message:
      'The live charcoal workshop was the highlight of my month. Small group, patient teaching, and I left with a drawing I am actually proud of.',
    createdAt: '2026-08-30',
  },
  {
    id: 6,
    name: 'Chloé Martin',
    rating: 5,
    message:
      'She photographed my maternity session with so much warmth and care. Every image feels like a quiet, golden moment I get to keep forever.',
    createdAt: '2026-09-14',
  },
]

export default testimonials // Lets other files load this list with: import testimonials from './seed-data/testimonials.js' (see db/seed.js)
