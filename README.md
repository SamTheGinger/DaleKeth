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

## Folder Structure, Authorisation and Database

A walkthrough of how the project is laid out, how signing in works, and how the app talks to the database. Read it top to bottom: each part builds on the one before.

### 1. The big picture

The project has three parts that run in three different places:

```
 Browser                      Vercel                          Railway                     Neon
┌──────────────┐   /api/...  ┌──────────────────────┐  /api/...  ┌──────────────────┐   SQL   ┌──────────────┐
│ React app    │ ──────────▶ │ my-react-app (built) │ ─────────▶ │ server (Express) │ ──────▶ │ Postgres     │
│ (what you    │ ◀────────── │ + vercel.json proxy  │ ◀───────── │ + Better Auth    │ ◀────── │ database     │
│  see)        │  JSON+cookie└──────────────────────┘            └──────────────────┘         └──────────────┘
```

- **Client** (`my-react-app/`): the React website. Hosted on **Vercel**.
- **Server** (`server/`): the Node.js + Express API. Hosted on **Railway**.
- **Database**: Postgres on **Neon**. Only the server can reach it.

The browser only ever talks to the Vercel address. `my-react-app/vercel.json` forwards every `/api/...` request on to Railway behind the scenes. Because of this, the sign-in cookie belongs to the website's own address (a *first-party* cookie), so browsers don't block it. In development, `vite.config.js` does the same job, forwarding `/api` from `localhost:5173` to the server on `localhost:3000`.

### 2. Folder structure

```
DaleKeth/
├── my-react-app/                  THE CLIENT (React + Vite + Tailwind, deployed to Vercel)
│   ├── index.html                 Page shell that loads the React app
│   ├── vite.config.js             Dev server settings; forwards /api to localhost:3000
│   ├── vercel.json                On Vercel, forwards /api/* to the Railway server
│   ├── public/Images/             All the photos (the database only stores their paths)
│   └── src/
│       ├── main.jsx               Starts React
│       ├── App.jsx                Picks the page from the URL; loads and saves favourites
│       ├── components/            Header (Sign In / Sign Out), Portfolio, Shop, Events, BookingForm,
│       │                          LoadState ("Loading…" / error message), cards and buttons
│       ├── pages/                 HomePage, GalleryPage, ArtworkPage, EventPage,
│       │                          AuthPage (sign in + sign up), NotFoundPage
│       ├── data/navLinks.js       The menu links (the only data left in the client)
│       └── utils/
│           ├── api.js             apiFetch() and the useApi() hook: every call to the server goes through here
│           ├── authClient.js      The browser half of Better Auth (useSession, signIn, signUp, signOut)
│           ├── useSubmit.js       Shared "send this form to the server" logic
│           ├── useHashRoute.js    The router (#/gallery/3, #/signin, ...)
│           └── format.js          Rand prices and dates
│
└── server/                        THE API (Node.js + Express 5, deployed to Railway)
    ├── .env                       Secrets: database URLs + auth secret (NOT in git)
    ├── .env.example               Empty template of .env (in git)
    ├── neon.ts                    Neon project settings (used by the neon CLI)
    ├── src/
    │   ├── index.js               Starts the server (app.listen)
    │   ├── app.js                 Builds the Express app: CORS, auth routes, JSON, our routes, errors
    │   ├── config.js              Reads environment variables; stops with a clear error if one is missing
    │   ├── db.js                  The Postgres connection pool + query() and transaction() helpers
    │   ├── auth.js                Better Auth setup + requireUser / optionalUser middleware
    │   ├── validate.js            Checks everything the browser sends (ids, emails, numbers)
    │   └── routes/
    │       ├── catalog.js         GET photos, artworks, events (public)
    │       ├── favorites.js       GET / PUT / DELETE favourites (signed-in only)
    │       └── bookings.js        POST the three forms (anyone; linked to the account if signed in)
    └── db/
        ├── schema.sql             CREATE TABLE statements for the site's own tables
        ├── migrate.js             npm run db:migrate: creates Better Auth's tables, then runs schema.sql
        ├── seed.js                npm run db:seed: copies seed-data/ into the tables
        ├── seed-data/             photos.js, artworks.js, events.js (the content that used to be hardcoded)
        └── use-direct-connection.js   Makes migrate/seed use Neon's direct connection (see section 4)
```

**Why split it this way?** The client is just files a browser downloads, so anyone can read its code. Anything secret (the database password, the auth secret) or anything that must be trusted (checking passwords, checking stock) has to live on the server, where visitors can't see or change it.

### 3. Authorisation (sign up, sign in, sessions)

Auth is handled by **[Better Auth](https://better-auth.com)**, a library with two halves:

| Half | File | What it does |
|---|---|---|
| Server | `server/src/auth.js` | `betterAuth({ database: pool, emailAndPassword: { enabled: true }, trustedOrigins })`: hashes passwords, stores users and sessions in Postgres, sets the cookie |
| Server | `server/src/app.js` | `app.all('/api/auth/{*any}', toNodeHandler(auth))` hands every `/api/auth/...` request to Better Auth |
| Browser | `my-react-app/src/utils/authClient.js` | `createAuthClient()` gives us `signUp.email`, `signIn.email`, `signOut` and the `useSession()` hook |

**What happens when someone signs up** (`my-react-app/src/pages/AuthPage.jsx`):

1. The form calls `authClient.signUp.email({ name, email, password })`, which sends `POST /api/auth/sign-up/email`.
2. Better Auth on the server checks that the email is new and the password is at least 8 characters.
3. It **hashes** the password (it's never stored as plain text) and saves a row in the `user` table, plus a row in `account` holding the hash.
4. It creates a row in the `session` table with a random token, and sends that token back as a **cookie**:
   `__Secure-better-auth.session_token=…; HttpOnly; Secure; SameSite=Lax`
   - `HttpOnly`: JavaScript on the page can't read it, so a malicious script can't steal it.
   - `Secure`: only ever sent over HTTPS.
   - `SameSite=Lax`: not sent with requests started by other websites.
5. From now on the browser sends that cookie with **every** `/api` request automatically (`credentials: 'include'` in `api.js`).

Sign-in works the same way (`POST /api/auth/sign-in/email`, comparing against the hash). Sign-out (`POST /api/auth/sign-out`) deletes the session row and clears the cookie.

**How the UI knows who's signed in:** `authClient.useSession()` asks `GET /api/auth/get-session` and shares the answer with every component that uses it.
- `Header.jsx` shows **Sign Out** when there's a session and **Sign In** when there isn't.
- The three forms fill in your name and email.
- `App.jsx` loads your favourites.

When you sign in or out, all of them update together.

**How the server protects routes** (`server/src/auth.js`):

```js
// For routes that NEED a signed-in user (favourites):
export async function requireUser(req, res, next) {
  const session = await getSession(req)       // reads the cookie, looks it up in the session table
  if (!session) return res.status(401).json({ error: 'Please sign in first.' })
  req.user = session.user                     // the route can now use req.user.id
  next()
}
```

- `favorites.js` uses `requireUser`, and every query includes `WHERE user_id = $1` with `req.user.id`. You can only ever see or change **your own** favourites, even if you call the API directly.
- `bookings.js` uses `optionalUser`: anyone can send a form, and if you're signed in the booking is linked to your account.

**Extra protection built in:**
- `trustedOrigins` (from the `CLIENT_ORIGINS` variable) means Better Auth refuses sign-in requests from any other website. This protects against cross-site request forgery (CSRF).
- Better Auth limits how many sign-in attempts can come from one address (rate limiting).

### 4. Database

**Where it is:** Postgres on **Neon** (project `snowy-river-22482224`, branch `production`). The connection details live in `server/.env`, which `neon env pull` / `neon deploy` filled in, and in Railway's **Variables** for the live server. They're never in git.

**Two connection strings**, both for the same database:

| Variable | Host | Used by | Why |
|---|---|---|---|
| `DATABASE_URL` | `…-pooler…neon.tech` | The running server (`src/db.js`) | Goes through Neon's connection pooler, built for lots of short queries from an app |
| `DATABASE_URL_UNPOOLED` | `…neon.tech` (no `-pooler`) | `npm run db:migrate` and `db:seed` | A direct connection; the pooler can break schema changes, so setup scripts skip it |

**How the server connects** (`server/src/db.js`): one shared **connection pool** from the `pg` (node-postgres) library. A pool keeps a few connections open and reuses them, so each request doesn't have to connect to Neon from scratch.

```js
export const pool = new pg.Pool({ connectionString: DATABASE_URL })

export async function query(text, values) {     // query('SELECT * FROM artworks WHERE id = $1', [id])
  const result = await pool.query(text, values)
  return result.rows
}
```

Values are always passed separately as `$1, $2, …`, never pasted into the SQL text. This prevents **SQL injection**: a visitor can't sneak their own SQL in through a form field.

`transaction()` runs several queries as **all or nothing**. Event bookings use it: taking spots off the event and saving the booking either both happen or neither does. The `UPDATE … WHERE spots >= $1` check means two people can never book the same last spot.

**The tables:**

| Table | Created by | What's in it |
|---|---|---|
| `user` | Better Auth | One row per account: name, email |
| `account` | Better Auth | The hashed password for each user |
| `session` | Better Auth | Who's signed in: token, user id, expiry (7 days) |
| `verification` | Better Auth | Used for email-verification codes (not used yet) |
| `photos` | `schema.sql` | The 12 portfolio series: title, category, cover image |
| `photo_images` | `schema.sql` | The images in each series, in order (one photo → many images) |
| `artworks` | `schema.sql` | The shop: price in rand, how many `available` |
| `events` | `schema.sql` | Upcoming events; `spots` has a `CHECK (spots >= 0)` so it can never go negative |
| `favorites` | `schema.sql` | Which user favourited which photo; `(user_id, photo_id)` can only appear once |
| `purchase_requests`, `event_bookings`, `photoshoot_bookings` | `schema.sql` | What people send through the three forms |

**How the tables relate.** These are *foreign keys*, meaning a column must match a real row in another table:

```
user ──< session                 (a user can have many sessions)
user ──< account
user ──< favorites >── photos    (many-to-many: users ↔ favourite photos)
photos ──< photo_images
artworks ──< purchase_requests
events   ──< event_bookings
user ──< purchase_requests / event_bookings / photoshoot_bookings   (optional link)
```

`ON DELETE CASCADE` on `favorites` means deleting a user also deletes their favourites. The forms use `ON DELETE SET NULL` instead, which keeps the booking but forgets the account.

**Setting up the database** (in `server/`):
1. `npm run db:migrate` (`db/migrate.js`):
   - First asks Better Auth to create its four tables (`getMigrations(auth.options)`).
   - Then runs `schema.sql`. The order matters, because `favorites` points at `user`, so `user` must exist first.
2. `npm run db:seed` (`db/seed.js`):
   - Reads `seed-data/photos.js`, `artworks.js` and `events.js` (the lists that used to be hardcoded in React) and inserts them.
   - Uses `ON CONFLICT (id) DO UPDATE`, so running it again updates rows instead of duplicating them.
   - It never resets stock (`available`, `spots`), so re-seeding can't undo real bookings.

Both scripts are safe to run more than once.

### 5. One request, start to finish

What happens when a signed-in visitor taps **Favourite** on a photo:

1. `PhotoCard` → `FavoriteToggle` calls `onFavoriteChange(photoId, true)`, which runs `handleFavoriteChange` in `App.jsx`.
2. `App.jsx` fills the heart straight away (an *optimistic update*), then calls `apiFetch('/api/favorites/3', { method: 'PUT' })`.
3. The browser sends `PUT /api/favorites/3` with the session cookie to Vercel, which forwards it to Railway.
4. In `app.js`, Express routes `/api/favorites` to `routes/favorites.js`.
5. `requireUser` reads the cookie, finds the session in Postgres and sets `req.user`.
6. The route runs `INSERT INTO favorites (user_id, photo_id) … ON CONFLICT DO NOTHING` through the pool to Neon.
7. The server replies `204 No Content`. If anything had failed, `App.jsx` would put the heart back the way it was.
8. Next time this user signs in, anywhere, `App.jsx` runs `GET /api/favorites` → `[3]`, and the heart is filled again.

### 6. Environment variables (`server/.env`)

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Pooled Neon connection for the running app |
| `DATABASE_URL_UNPOOLED` | Direct Neon connection for migrate and seed |
| `BETTER_AUTH_SECRET` | Long random string Better Auth uses to sign cookies. If it leaked, someone could forge sessions |
| `BETTER_AUTH_URL` | The address people use for the site (`http://localhost:5173` locally, the Vercel URL live) |
| `CLIENT_ORIGINS` | Websites allowed to sign in; anything else gets "Invalid origin" |
| `PORT` | Local only; Railway sets its own |

`server/.gitignore` lists `.env`, so it's never committed. `server/src/config.js` stops the server with a clear message if a required variable is missing.

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

**Pushing to `main` deploys both automatically.** Railway rebuilds the API from `server/` and Vercel rebuilds the site from `my-react-app/` (each project's Root Directory is set to its folder). Watch the builds in each dashboard.

To deploy without pushing (for example, to try something out), use the command-line tools:

```bash
cd server && railway up --service api        # needs: npm i -g @railway/cli, railway login
cd my-react-app && vercel deploy --prod      # needs: npm i -g vercel, vercel login
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
