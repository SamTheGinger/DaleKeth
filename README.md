# Aurora Photography

A responsive, dark-themed portfolio, art shop and event-booking site for a portrait and landscape photographer.
Started for the **Mayerfeld Frontend Developer Practicum** as a static HTML/CSS landing page, and now rebuilt with **React 19**, **Vite** and **Tailwind CSS 4**.

**Live site:** https://aurora-photography-roan.vercel.app · **API:** https://api-production-09396.up.railway.app/api/health

## Week 3: a real backend

- **Client + server.** `my-react-app/` is the React frontend; the new `server/` folder is a **Node.js + Express 5** API.
- **Postgres database (Neon).** Photos, gallery images, artworks and events now live in database tables instead of JavaScript files. A **seed script** (`npm run db:seed`) loads the old hardcoded data into it.
- **A real API.** The React app loads everything with `fetch` from routes such as `GET /api/photos` (see the table below).
- **Authentication with [Better Auth](https://better-auth.com).** Sign up, sign in and sign out with email + password. Passwords are hashed and sessions are kept in an httpOnly cookie. The header shows **Sign In** or **Sign Out**.
- **Favourites are saved to your account** and come back when you sign in on any device.
- **The forms work.** Photoshoot bookings, artwork purchase requests and event bookings are saved in the database. Booking an event takes the spots off, and two people can never book the same last spot.
- **Secrets stay out of git.** The database URL and auth secret live in `server/.env`, which is ignored (`server/.env.example` is the empty template).

## What's new since the previous README update

- **Rebuilt in React + Tailwind.** The old `index.html`, `styles.css` and `nav.js` were replaced by a Vite React app in `my-react-app/`. The original colours, fonts and 900px breakpoint were carried over as Tailwind theme tokens.
- **Multiple pages** using a small hash router (`#/gallery/3`, `#/artwork/1`, `#/event/2`), with working Back/Forward buttons and a "Page Not Found" page.
- **Portfolio filters:** All, Portrait, Landscape and Favourites. Each photo card has a Favourite toggle.
- **Gallery pages:** clicking a portfolio card opens its full image series, and each image has a Like (heart) button. Favourites and likes are kept while moving between pages.
- **Shop:** six charcoal artworks with prices in rand (e.g. R 6 500), each with its own sale page, a quantity stepper (capped at the number available) and a purchase-request form.
- **Events:** three upcoming events with dates, venues and prices, each with a booking page for choosing how many spots.
- **New photos:** 12 photo series (9 portrait, 3 landscape) in WebP format, plus artwork and event images. Images and prices were updated in the gallery and shop.
- **Look and responsiveness:** minor design tweaks, and the layout was checked on phone, tablet and desktop.
- **Fixes:** a round of bug fixes across the header, hero, about, events and detail pages, and a fuller `.gitignore`.
- Beginner-friendly comments explaining each part of the code are in every file.

## Features

- Sticky header with a hamburger menu below 900px
- Full-width hero banner with a dark overlay
- About section ("The Woman Behind The Lens")
- Portfolio grid with filters and favourites, linking to likeable gallery pages
- Shop and Events sections with detail pages, quantity steppers and live price totals
- Photoshoot booking form
- Smooth scrolling between sections, even when coming from another page
- Mobile-first layout: 1 column on phones, 2 on tablets, 3 on desktop

## Project structure

```
my-react-app/                  THE CLIENT (deployed to Vercel)
├── index.html                 Page shell that loads the React app
├── vite.config.js             Vite settings (React + Tailwind plugins, /api forwarded to the server)
├── vercel.json                On Vercel, forwards /api/* to the Railway server
├── public/Images/             All photos, grouped by series (Copper, Ebony, Charcoal-Art, Events, ...)
└── src/
    ├── main.jsx               Starts the app
    ├── App.jsx                Picks which page to show; holds favourites and likes
    ├── index.css              Tailwind import, colour/font tokens and base styles
    ├── components/            Header, Hero, About, Portfolio, Shop, Events, BookingForm, Footer and smaller cards/buttons
    ├── pages/                 HomePage, GalleryPage, ArtworkPage, EventPage, AuthPage, NotFoundPage
    ├── data/                  navLinks.js (the menu)
    └── utils/                 api.js (fetch + useApi), authClient.js (Better Auth), useSubmit.js (forms),
                               format.js (rand prices, dates) and useHashRoute.js (the router)

server/                        THE API (deployed to Railway)
├── .env.example               The settings it needs (copy to .env; .env is never committed)
├── src/
│   ├── index.js               Starts the server
│   ├── app.js                 Express app: middleware, routes and error handling
│   ├── auth.js                Better Auth setup + requireUser / optionalUser middleware
│   ├── db.js                  Postgres connection pool, query() and transaction()
│   ├── validate.js            Checks what the browser sent
│   └── routes/                catalog.js (photos/artworks/events), favorites.js, bookings.js
└── db/
    ├── schema.sql             The site's tables
    ├── migrate.js             npm run db:migrate: creates Better Auth's tables, then schema.sql
    ├── seed.js                npm run db:seed: loads seed-data/ into the database
    └── seed-data/             photos.js, artworks.js, events.js (the content that used to be hardcoded)
```

## Database

| Table | What's in it |
|---|---|
| `user`, `session`, `account`, `verification` | Created and managed by Better Auth (accounts, hashed passwords, sessions) |
| `photos`, `photo_images` | Portfolio series and the images in each one, in order |
| `artworks` | The shop: price in rand and how many are `available` |
| `events` | Upcoming events and how many `spots` are left (can never go below 0) |
| `favorites` | Which photo series each user has favourited |
| `purchase_requests`, `event_bookings`, `photoshoot_bookings` | What people send through the three forms (linked to their account if signed in) |

## API

| Route | Sign-in needed? | What it does |
|---|---|---|
| `GET /api/health` | No | `{ "ok": true }` if the server is running |
| `GET /api/photos` · `GET /api/photos/:id` | No | Portfolio series with their gallery images |
| `GET /api/artworks` · `GET /api/artworks/:id` | No | Artwork for sale |
| `GET /api/events` · `GET /api/events/:id` | No | Upcoming events, soonest first |
| `POST /api/artworks/:id/purchase-requests` | No | `{ quantity, name, email }` |
| `POST /api/events/:id/bookings` | No | `{ spots, name, email, phone }`; replies with `spotsLeft` |
| `POST /api/photoshoot-bookings` | No | `{ name, email, phone, style }` |
| `GET /api/favorites` | Yes | The signed-in user's favourite photo ids, e.g. `[3, 11]` |
| `PUT` / `DELETE /api/favorites/:photoId` | Yes | Add / remove a favourite |
| `/api/auth/*` | | Better Auth: `sign-up/email`, `sign-in/email`, `sign-out`, `get-session` |

## Run it locally

You need [Node.js](https://nodejs.org/) 20 or newer and a free [Neon](https://neon.tech) Postgres database.

**1. The server** (first terminal):

```bash
cd server
npm install                 # first time only
cp .env.example .env        # then open .env and fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run db:migrate          # create the tables (safe to run again)
npm run db:seed             # load the photos, artworks and events (safe to run again)
npm run dev                 # API on http://localhost:3000; restarts when you save
```

**2. The client** (second terminal):

```bash
cd my-react-app
npm install      # first time only
npm run dev      # open http://localhost:5173. Vite forwards /api to the server.
```

Other client commands:

| Command | What it does |
|---|---|
| `npm run build` | Builds the finished site into `dist/` |
| `npm run preview` | Serves the built site to check it before publishing |
| `npm run lint` | Checks the code with Oxlint |

## Customising

| To change… | Edit |
|---|---|
| Colours, fonts, breakpoint | The `@theme` block in `my-react-app/src/index.css` |
| Portfolio photos and gallery series | `server/db/seed-data/photos.js` then `npm run db:seed` (images go in `my-react-app/public/Images/`) |
| Artwork, prices and stock | `server/db/seed-data/artworks.js` then `npm run db:seed` |
| Events, dates and spots | `server/db/seed-data/events.js` then `npm run db:seed` |
| Menu links | `my-react-app/src/data/navLinks.js` |

Re-seeding updates titles, prices, images and so on, but never resets stock (`available`, `spots`), so it won't undo real bookings. To change stock, edit it in the Neon SQL editor.

## Deploying

The API runs on **Railway** and the site on **Vercel**. Vercel forwards every `/api/...` request to Railway (`my-react-app/vercel.json`), so the browser only ever talks to the Vercel address. The sign-in cookie is then a normal first-party cookie, which browsers don't block.

| Part | Where | Project |
|---|---|---|
| Database | Neon, project `snowy-river-22482224`, branch `production` | `server/neon.ts` |
| API | Railway, project `aurora-photography`, service `api` (Node 22) | https://api-production-09396.up.railway.app |
| Site | Vercel, project `aurora-photography` (team the-blu-vibe) | https://aurora-photography-roan.vercel.app |

Both were deployed from the command line, so **pushing to GitHub does not redeploy them**. After changing code:

```bash
cd server && railway up --service api        # redeploy the API (needs: npm i -g @railway/cli, railway login)
cd my-react-app && vercel deploy --prod      # redeploy the site (needs: npm i -g vercel, vercel login)
```

After changing the tables or the seed data, run `npm run db:migrate` / `npm run db:seed` in `server/` (they use the direct Neon connection from `server/.env`).

Railway variables: `DATABASE_URL` and `DATABASE_URL_UNPOOLED` (from `neon env pull`), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `CLIENT_ORIGINS` (both `https://aurora-photography-roan.vercel.app`), and `NODE_ENV=production`. If the site's address ever changes, update the last two, or sign-in will be refused with "Invalid origin".

## Fonts

[Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (headings) and [Inter](https://fonts.google.com/specimen/Inter) (body), loaded from Google Fonts.

## Next steps

- Email the photographer (and the customer) when a form is sent, for example with Resend.
- Take payments for artwork and event tickets (for example PayFast, Yoco or Stripe).
- Save gallery likes to the account too (favourites are saved; likes still reset on refresh).
- An admin page for viewing bookings (for now, use the Neon dashboard's Tables view).
- Update `CODE-WALKTHROUGH.md`, which still explains the old HTML/CSS version.

## Credits

© 2026 Aurora Photography. Built by Sam Collins.
