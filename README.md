# Aurora Photography

A responsive, dark-themed portfolio, art shop and event-booking site for a portrait and landscape photographer.
Started for the **Mayerfeld Frontend Developer Practicum** as a static HTML/CSS landing page, and now rebuilt with **React 19**, **Vite** and **Tailwind CSS 4**.

**Live site:** https://aurora-photography-roan.vercel.app · **API:** https://aurora-photography-api.vercel.app/api/health

## Latest: buying event spots with Stripe (test mode)

- **Buy Spots for paid events.** On a paid event's page, pick 1 to 10 spots and click **Buy**. The site creates an order and sends you to **Stripe Checkout**, Stripe's own payment page. It's in **test mode**: the money is fake, so pay with the test card `4242 4242 4242 4242`, any future date and any CVC.
- **Sign-in required.** Only signed-in accounts can buy, so every order belongs to a real user. Visitors see **Sign In to Buy** and come back to the event afterwards.
- **The price comes from the database,** never from the browser. The browser only says which event and how many spots.
- **A webhook confirms the payment.** When Stripe has the money, it calls `POST /api/webhooks/stripe`. That route checks Stripe's signature and is the **only** code that marks an order as **paid** and takes the spots off the event.
- **Order page (`#/order/5`).** Stripe sends you back here after paying. It shows the order, re-checking every 2 seconds in case the webhook arrives a moment after you do, and ends on **"✓ Payment received"**.
- **New tables:** `orders` (one row per purchase) and `order_items` (which event, how many spots, and the price paid). See [section 7](#7-payments-stripe-checkout).
- **Free events** (like *Aurora After Dark*, R0) keep a free **Reserve a Spot** form, because Stripe can't charge R0. The server refuses that form for paid events, so nobody can skip paying.
- **Artworks** keep their **Request to Buy** form (no payment online).
- **The API moved from Railway to Vercel.** Railway's deploys were paused, so the Express server now runs as its own Vercel project (`aurora-photography-api`). See [Deploying](#deploying).

## Before that: email subscriptions and a tidier header

- **"View" drop-down in the header.** Portfolio, Shop, Events, Book and Subscribe are grouped under **View ▾**, so the header fits on one row on laptops. On phones, View unfolds inside the ☰ menu.
- **Email subscriptions, sent with [Resend](https://resend.com)** from `sam@bluvibe.co.za` (the bluvibe.co.za domain is verified in Resend):
  - A **"Send me news, new work and event updates"** tick box on *Create Account*. It starts unticked, so subscribing is always the visitor's choice (opt-in, as South Africa's POPIA law expects).
  - A small **"Stay In The Loop"** section at the bottom of the home page. Signed-in visitors subscribe with one click; everyone else is asked to create an account.
  - The View menu shows **Subscribe** (jumps to that section) or, once you're subscribed, **Subscribed ✓**, which opens a **Your Subscription** page (`#/subscription`): what you get, why it's worth it, and an **Unsubscribe** button (with an "Are you sure?").
  - Every new subscriber is emailed to **sam@bluvibe.co.za** and added to the **Aurora Photography subscribers** list in Resend, ready for bulk emails (Broadcasts).
  - Unsubscribing, on the site **or** with the link in a bulk email, sends a **"You've unsubscribed"** email with a **Subscribe again** button. Bulk-email unsubscribes reach the site through a Resend **webhook**.
- **Footer:** "Say Hello." now has an **Email Me** link (opens a new email to sam@bluvibe.co.za) with the address underneath.

## Week 3: a real backend

- **Client + server.** `my-react-app/` is the React frontend; the new `server/` folder is a **Node.js + Express 5** API.
- **Postgres database (Neon).** Photos, gallery images, artworks and events now live in database tables instead of JavaScript files. A **seed script** (`npm run db:seed`) loads the old hardcoded data into it.
- **A real API.** The React app loads everything with `fetch` from routes such as `GET /api/photos` (see the table below).
- **Authentication with [Better Auth](https://better-auth.com).** Sign up, sign in and sign out with email + password. Passwords are hashed and sessions are kept in an httpOnly cookie. The header shows **Sign In** or **Sign Out**.
- **Favourites are saved to your account** and come back when you sign in on any device.
- **The forms work.** Photoshoot bookings, artwork purchase requests and event bookings are saved in the database. Booking an event takes the spots off, and two people can never book the same last spot.
- **Secrets stay out of git.** The database URL and auth secret live in `server/.env`, which is ignored (`server/.env.example` is the empty template).

## Week 2: rebuilt in React

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

- Sticky header with a hamburger menu below 900px, and a **View ▾** drop-down for the page sections
- Full-width hero banner with a dark overlay
- About section ("The Woman Behind The Lens")
- Portfolio grid with filters and favourites, linking to likeable gallery pages
- Shop and Events sections with detail pages, quantity steppers and live price totals
- Buy event spots with Stripe Checkout (test mode), with an order page that confirms the payment; free events are reserved with a form
- Photoshoot booking form
- Accounts (sign up, sign in, sign out) with favourites saved to your account
- Email subscriptions: opt-in at sign-up, a "Stay In The Loop" section, and a Your Subscription page with unsubscribe
- Smooth scrolling between sections, even when coming from another page
- Mobile-first layout: 1 column on phones, 2 on tablets, 3 on desktop

## Folder Structure, Authorisation and Database

A walkthrough of how the project is laid out, how signing in works, and how the app talks to the database. Read it top to bottom: each part builds on the one before.

### 1. The big picture

The project has three parts that run in three different places:

```
 Browser                      Vercel (site)                   Vercel (API)                Neon
┌──────────────┐   /api/...  ┌──────────────────────┐  /api/...  ┌──────────────────┐   SQL   ┌──────────────┐
│ React app    │ ──────────▶ │ my-react-app (built) │ ─────────▶ │ server (Express) │ ──────▶ │ Postgres     │
│ (what you    │ ◀────────── │ + vercel.json proxy  │ ◀───────── │ + Better Auth    │ ◀────── │ database     │
│  see)        │  JSON+cookie└──────────────────────┘            └──────────────────┘         └──────────────┘
       │                                                                  ▲
       │  Buy: redirected to Stripe's checkout page          ┌────────────┴─────┐
       └───────────────────────────────────────────────────▶ │ Stripe (test)    │  webhook: "this order is paid"
                                                             └──────────────────┘
```

- **Client** (`my-react-app/`): the React website. Hosted on **Vercel**, project `aurora-photography`.
- **Server** (`server/`): the Node.js + Express API. Hosted on **Vercel** too, as a separate project, `aurora-photography-api`. It was on Railway until Railway's deploys were paused.
- **Database**: Postgres on **Neon**. Only the server can reach it.
- **Payments**: **Stripe** in test mode. The buyer pays on Stripe's page; Stripe then tells the server directly (the webhook).

The browser only ever talks to the site's address. `my-react-app/vercel.json` forwards every `/api/...` request on to the API behind the scenes. Because of this, the sign-in cookie belongs to the website's own address (a *first-party* cookie), so browsers don't block it. In development, `vite.config.js` does the same job, forwarding `/api` from `localhost:5173` to the server on `localhost:3000`.

### 2. Folder structure

```
DaleKeth/
├── my-react-app/                  THE CLIENT (React + Vite + Tailwind, deployed to Vercel)
│   ├── index.html                 Page shell that loads the React app
│   ├── vite.config.js             Dev server settings; forwards /api to localhost:3000
│   ├── vercel.json                On Vercel, forwards /api/* to the API (aurora-photography-api.vercel.app)
│   ├── public/Images/             All the photos (the database only stores their paths)
│   └── src/
│       ├── main.jsx               Starts React
│       ├── App.jsx                Picks the page from the URL; loads and saves favourites
│       ├── components/            Header (View ▾ drop-down, Sign In / Sign Out), Portfolio, Shop, Events,
│       │                          BookingForm, SubscribeSection ("Stay In The Loop"), Footer,
│       │                          LoadState ("Loading…" / error message), cards and buttons
│       ├── pages/                 HomePage, GalleryPage, ArtworkPage, EventPage (Buy Spots with Stripe, or
│       │                          Reserve for free events), OrderPage (#/order/5, after paying), AuthPage
│       │                          (sign in + sign up, with the email tick box), SubscriptionPage, NotFoundPage
│       ├── data/navLinks.js       The menu links, including the View group (the only data left in the client)
│       └── utils/
│           ├── api.js             apiFetch() and the useApi() hook: every call to the server goes through here
│           ├── authClient.js      The browser half of Better Auth (useSession, signIn, signUp, signOut, refreshSession)
│           ├── useSubmit.js       Shared "send this form to the server" logic
│           ├── useHashRoute.js    The router (#/gallery/3, #/signin, ...)
│           └── format.js          Rand prices and dates
│
└── server/                        THE API (Node.js + Express 5, deployed to Vercel as aurora-photography-api)
    ├── .env                       Secrets: database URLs, auth secret, Resend and Stripe keys (NOT in git)
    ├── .env.example               Empty template of .env (in git)
    ├── vercel.json                Tells Vercel this folder is an Express app
    ├── .vercelignore              Keeps .env out of uploads to Vercel
    ├── neon.ts                    Neon project settings (used by the neon CLI)
    ├── src/
    │   ├── index.js               Starts the server (app.listen)
    │   ├── app.js                 Builds the Express app: CORS, auth routes, JSON, our routes, errors
    │   ├── config.js              Reads environment variables; stops with a clear error if one is missing
    │   ├── db.js                  The Postgres connection pool + query() and transaction() helpers
    │   ├── auth.js                Better Auth setup (+ the marketingOptIn field and sign-up hook),
    │   │                          requireUser / optionalUser middleware
    │   ├── email.js               Resend: subscriber notifications, the subscribers list, unsubscribe emails
    │   ├── stripe.js              The Stripe client (null when STRIPE_SECRET_KEY isn't set)
    │   ├── validate.js            Checks everything the browser sends (ids, emails, numbers)
    │   └── routes/
    │       ├── catalog.js         GET photos, artworks, events (public)
    │       ├── favorites.js       GET / PUT / DELETE favourites (signed-in only)
    │       ├── bookings.js        POST the three forms (anyone; linked to the account if signed in).
    │       │                      Event reservations are for FREE events only
    │       ├── orders.js          POST /api/checkout and GET /api/orders/:id (signed-in only)
    │       ├── stripeWebhook.js   Stripe tells us a payment went through: the only place an order becomes paid
    │       ├── subscription.js    GET / POST / DELETE the signed-in person's email subscription
    │       └── resendWebhook.js   Resend tells us when someone unsubscribes from a bulk email
    └── db/
        ├── schema.sql             CREATE TABLE statements for the site's own tables
        ├── migrate.js             npm run db:migrate: creates Better Auth's tables, then runs schema.sql
        ├── seed.js                npm run db:seed: copies seed-data/ into the tables
        ├── seed-data/             photos.js, artworks.js, events.js (the content that used to be hardcoded)
        ├── sync-subscribers.js    npm run subscribers:sync: adds every opted-in account to the Resend list
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
- `Header.jsx` shows **Sign Out** when there's a session and **Sign In** when there isn't, and **Subscribe** or **Subscribed ✓** in the View menu (from `session.user.marketingOptIn`).
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
- `orders.js` uses `requireUser` too: you can't start a checkout without an account, and `GET /api/orders/:id` only finds orders where `user_id` is yours (anyone else's order number answers 404).
- `bookings.js` uses `optionalUser`: anyone can send a form, and if you're signed in the booking is linked to your account.

**Extra protection built in:**
- `trustedOrigins` (from the `CLIENT_ORIGINS` variable) means Better Auth refuses sign-in requests from any other website. This protects against cross-site request forgery (CSRF).
- Better Auth limits how many sign-in attempts can come from one address (rate limiting).

### 4. Database

**Where it is:** Postgres on **Neon** (project `snowy-river-22482224`, branch `production`). The connection details live in `server/.env`, which `neon env pull` / `neon deploy` filled in, and in the `aurora-photography-api` Vercel project's **Environment Variables** for the live server. They're never in git.

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

`transaction()` runs several queries as **all or nothing**. Free event reservations use it: taking spots off the event and saving the booking either both happen or neither does. The `UPDATE … WHERE spots >= $1` check means two people can never reserve the same last spot. Checkout and the Stripe webhook use it too (see section 7).

**The tables:**

| Table | Created by | What's in it |
|---|---|---|
| `user` | Better Auth | One row per account: name, email, plus our extra `marketingOptIn` column (true = subscribed to the emails) |
| `account` | Better Auth | The hashed password for each user |
| `session` | Better Auth | Who's signed in: token, user id, expiry (7 days) |
| `verification` | Better Auth | Used for email-verification codes (not used yet) |
| `photos` | `schema.sql` | The 12 portfolio series: title, category, cover image |
| `photo_images` | `schema.sql` | The images in each series, in order (one photo → many images) |
| `artworks` | `schema.sql` | The shop: price in rand, how many `available` |
| `events` | `schema.sql` | Upcoming events; `spots` has a `CHECK (spots >= 0)` so it can never go negative |
| `favorites` | `schema.sql` | Which user favourited which photo; `(user_id, photo_id)` can only appear once |
| `purchase_requests`, `event_bookings`, `photoshoot_bookings` | `schema.sql` | What people send through the three forms (`event_bookings` = free events only now) |
| `orders` | `schema.sql` | One row per purchase of event spots: who (`user_id`, required), `status` (`pending` → `paid`, or `expired`), `total` in rand, the Stripe session id, `paid_at` |
| `order_items` | `schema.sql` | What each order bought: the event, how many spots, and the title and `unit_price` **copied** at the time of purchase |

**How the tables relate.** These are *foreign keys*, meaning a column must match a real row in another table:

```
user ──< session                 (a user can have many sessions)
user ──< account
user ──< favorites >── photos    (many-to-many: users ↔ favourite photos)
photos ──< photo_images
artworks ──< purchase_requests
events   ──< event_bookings
user ──< purchase_requests / event_bookings / photoshoot_bookings   (optional link)
user ──< orders ──< order_items >── events                          (required link: every order has an owner)
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
3. The browser sends `PUT /api/favorites/3` with the session cookie to the site on Vercel, which forwards it to the API.
4. In `app.js`, Express routes `/api/favorites` to `routes/favorites.js`.
5. `requireUser` reads the cookie, finds the session in Postgres and sets `req.user`.
6. The route runs `INSERT INTO favorites (user_id, photo_id) … ON CONFLICT DO NOTHING` through the pool to Neon.
7. The server replies `204 No Content`. If anything had failed, `App.jsx` would put the heart back the way it was.
8. Next time this user signs in, anywhere, `App.jsx` runs `GET /api/favorites` → `[3]`, and the heart is filled again.

### 6. Email subscriptions (Resend)

Emails go through **[Resend](https://resend.com)**, an email-sending service. The domain **bluvibe.co.za** is verified there (three DNS records at Register Domain SA), so emails can come from `sam@bluvibe.co.za` and land in inboxes rather than spam. All the Resend code is in `server/src/email.js`.

**Where "subscribed" is stored:** a `marketingOptIn` column on Better Auth's `user` table. `auth.js` declares it as an extra field (`user.additionalFields`), so Better Auth adds the column (`npm run db:migrate`), accepts it from the sign-up form, and includes it in the session. That's how the header knows whether to show **Subscribe** or **Subscribed ✓** without asking the server separately.

**Three ways to subscribe, one result:**

| How | Code |
|---|---|
| Tick the box on *Create Account* | `AuthPage.jsx` sends `marketingOptIn: true`; a Better Auth **hook** (`databaseHooks.user.create.after` in `auth.js`) runs after the account is saved |
| Click **Subscribe** in "Stay In The Loop" | `SubscribeSection.jsx` → `POST /api/subscription` |
| Click **Subscribe (Again)** on Your Subscription | `SubscriptionPage.jsx` → `POST /api/subscription` |

Each one: sets `marketingOptIn = true`, adds the person to the **Aurora Photography subscribers** list (a Resend "segment"), and emails **sam@bluvibe.co.za** ("New email subscriber: …", Reply goes to the subscriber). A failed email never stops the sign-up; it's only logged.

**Two ways to unsubscribe, one result:**

| How | What happens |
|---|---|
| **Unsubscribe** on Your Subscription | `DELETE /api/subscription`: sets `marketingOptIn = false`, marks them unsubscribed in Resend, sends the "You've unsubscribed" email |
| The unsubscribe link at the bottom of a bulk email | Resend marks them unsubscribed, then calls our **webhook** (`POST /api/webhooks/resend`, event `contact.updated`). `resendWebhook.js` checks the message's signature (so nobody can fake one), sets `marketingOptIn = false` and sends the same email |

The "You've unsubscribed" email has a **Subscribe again** button that opens `#/subscription`. Only one confirmation is ever sent: the website path updates our database *before* telling Resend, so when Resend's webhook arrives a moment later it sees the account is already unsubscribed and stays quiet. As a back-up, `GET /api/subscription` also checks Resend, in case a webhook was ever missed.

**Never re-subscribed by accident:** `addSubscriberToList()` leaves anyone who unsubscribed alone. Only the person clicking Subscribe themselves can re-subscribe them.

**Keeping the page in sync:** after subscribing or unsubscribing, the page calls `refreshSession()` (`authClient.js`). That fires Better Auth's own "session changed" signal, so every component using `useSession()`, including the header, updates at once without a reload.

**Sending a bulk email** (done in the Resend dashboard, not in code):
1. [resend.com/broadcasts](https://resend.com/broadcasts) → **Create broadcast**.
2. **From** `Sam <sam@bluvibe.co.za>`, **Segment** *Aurora Photography subscribers*, then a subject.
3. Write the email, click **Send test** to check it, then **Send** or **Schedule**.

Resend adds the unsubscribe link automatically and never emails anyone who has unsubscribed.

### 7. Payments (Stripe Checkout)

Paid event spots are bought with **[Stripe Checkout](https://stripe.com/docs/payments/checkout)** in **test mode**: a real checkout, a real webhook and a real order in the database, with fake money.

**A purchase, start to finish:**

1. On a paid event's page (`EventPage.jsx`), a signed-in visitor picks a number of spots and clicks **Buy**. The page calls `POST /api/checkout` with `{ eventId, spots }`. **No price is sent.**
2. `orders.js` (behind `requireUser`) looks the event up in the database. It refuses past events, free events, and more spots than are left (at most 10). The price comes from the `events` table.
3. In one **transaction** it:
   - inserts an `orders` row (`status = 'pending'`, `total` = price × spots);
   - inserts an `order_items` row, copying the event's title and price;
   - asks Stripe for a **Checkout Session**. The amount is in cents (R 250 = `25000`), with `metadata.orderId` set so Stripe can tell us later which order this is.

   It then saves the session id on the order. If Stripe fails, the whole transaction is undone, so no half-made order is left behind.
4. The server replies with the session's `url`, and the browser goes there: **Stripe's own payment page**. Our site never sees the card number.
5. The buyer pays (test card `4242 4242 4242 4242`). Stripe then does two things separately:
   - **Redirects the buyer** to `#/order/<id>` (`OrderPage.jsx`).
   - **Calls our webhook**, `POST /api/webhooks/stripe`, with a `checkout.session.completed` event.
6. `stripeWebhook.js`:
   - Checks the **signature** with `STRIPE_WEBHOOK_SECRET`, so a fake "it's paid" message is rejected with 400.
   - In one transaction, runs `UPDATE orders SET status = 'paid' … WHERE status = 'pending'` and takes the spots off the event.
   - Because of `WHERE status = 'pending'`, if Stripe sends the same event twice, the second one changes nothing. That's called being **idempotent**.
7. `OrderPage.jsx` calls `GET /api/orders/:id`. The webhook can arrive a moment *after* the buyer, so while the order still says `pending` it asks again every 2 seconds (up to about 10 seconds, then shows a **Check Again** button). Then it shows **"✓ Payment received"**.

**Why only the webhook marks orders as paid.** Anyone can type `#/order/5` into the address bar, so landing on the success page proves nothing. Only Stripe knows the payment really happened, and only a correctly signed message from Stripe is trusted.

**Other things the code handles:**
- If someone abandons the checkout, Stripe sends `checkout.session.expired` after 24 hours and the order becomes `expired`. Spots are only taken when an order is **paid**, so an abandoned checkout never holds any.
- If two people pay for the very last spot at the same moment, the money has already been taken, so both orders stay paid. The webhook logs a warning for a manual refund from the Stripe dashboard.
- **Free events can't go through Stripe**, which can't charge R0. They use the free reservation form, and `bookings.js` only accepts it when `price = 0` (in the SQL itself), so calling it directly can't get you paid spots for free.

**Testing it locally** with the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # prints a whsec_... secret: put it in server/.env
```

Then run the server and client (see [Run it locally](#run-it-locally)), sign in, buy spots, and pay with `4242 4242 4242 4242`, any future date and any CVC.

**Live:** Stripe (Test mode) → Developers → Webhooks has an endpoint at `https://aurora-photography-api.vercel.app/api/webhooks/stripe` for `checkout.session.completed` and `checkout.session.expired`. Its own signing secret is the `STRIPE_WEBHOOK_SECRET` set on the API's Vercel project. It's different from the one `stripe listen` prints.

**Seeing the orders:** open the Neon dashboard → Tables → `orders` / `order_items`, or run this in the SQL editor:

```sql
SELECT o.id, u.email, o.status, o.total, i.title, i.quantity, o.created_at, o.paid_at
FROM orders o JOIN "user" u ON u.id = o.user_id JOIN order_items i ON i.order_id = o.id
ORDER BY o.id DESC;
```

### 8. Environment variables (`server/.env`)

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Pooled Neon connection for the running app |
| `DATABASE_URL_UNPOOLED` | Direct Neon connection for migrate and seed |
| `BETTER_AUTH_SECRET` | Long random string Better Auth uses to sign cookies. If it leaked, someone could forge sessions |
| `BETTER_AUTH_URL` | The address people use for the site (`http://localhost:5173` locally, the Vercel URL live) |
| `CLIENT_ORIGINS` | Websites allowed to sign in; anything else gets "Invalid origin" |
| `PORT` | Local only; Vercel chooses its own |
| `RESEND_API_KEY` | Resend key (Full access: it manages the subscriber list, not just sending). Optional: without it the site works and emails are skipped |
| `EMAIL_FROM` | Who emails come from: `Aurora Photography <sam@bluvibe.co.za>` |
| `MARKETING_NOTIFY_EMAIL` | Who's told about new subscribers: `sam@bluvibe.co.za` |
| `RESEND_SEGMENT_ID` | The id of the *Aurora Photography subscribers* list in Resend (`npm run subscribers:sync` creates the list and prints it) |
| `RESEND_WEBHOOK_SECRET` | Lets the server check that webhook calls really come from Resend (Resend → Webhooks → signing secret) |
| `STRIPE_SECRET_KEY` | Stripe **test** secret key (`sk_test_…`, Stripe → Developers → API keys). Optional: without it, Buy says "Payments aren't set up yet" |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…`: lets the server check that webhook calls really come from Stripe. Locally it's the one `stripe listen` prints; live, the one on the webhook endpoint in Stripe |

`server/.gitignore` lists `.env`, so it's never committed. `server/src/config.js` stops the server with a clear message if a required variable is missing.

## API

| Route | Sign-in needed? | What it does |
|---|---|---|
| `GET /api/health` | No | `{ "ok": true }` if the server is running |
| `GET /api/photos` · `GET /api/photos/:id` | No | Portfolio series with their gallery images |
| `GET /api/artworks` · `GET /api/artworks/:id` | No | Artwork for sale |
| `GET /api/events` · `GET /api/events/:id` | No | Upcoming events, soonest first |
| `POST /api/artworks/:id/purchase-requests` | No | `{ quantity, name, email }` |
| `POST /api/events/:id/bookings` | No | **Free events only.** `{ spots, name, email, phone }`; replies with `spotsLeft` |
| `POST /api/checkout` | Yes | `{ eventId, spots }` for a paid event → `{ url }` (Stripe's checkout page). Creates a `pending` order |
| `GET /api/orders/:id` | Yes | One of **your** orders: `{ id, status, total, date, items: [...] }` |
| `POST /api/photoshoot-bookings` | No | `{ name, email, phone, style }` |
| `GET /api/favorites` | Yes | The signed-in user's favourite photo ids, e.g. `[3, 11]` |
| `PUT` / `DELETE /api/favorites/:photoId` | Yes | Add / remove a favourite |
| `GET /api/subscription` | Yes | `{ subscribed, changed }`: is the signed-in person getting the emails? |
| `POST /api/subscription` | Yes | Subscribe (adds them to the Resend list, emails the photographer) |
| `DELETE /api/subscription` | Yes | Unsubscribe (and email them a confirmation with a "Subscribe again" button) |
| `POST /api/webhooks/resend` | Resend only | Called by Resend when a contact changes; signature-checked |
| `POST /api/webhooks/stripe` | Stripe only | Called by Stripe when a checkout is paid or expires; signature-checked. The only thing that marks orders paid |
| `/api/auth/*` | | Better Auth: `sign-up/email`, `sign-in/email`, `sign-out`, `get-session` |

## Run it locally

You need [Node.js](https://nodejs.org/) 22 or newer and a free [Neon](https://neon.tech) Postgres database. A [Resend](https://resend.com) key is optional; without it, everything works except the emails. A [Stripe](https://stripe.com) test key is optional too; without it, everything works except buying event spots (see section 7 for testing payments locally).

**1. The server** (first terminal):

```bash
cd server
npm install                 # first time only
cp .env.example .env        # then open .env and fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run db:migrate          # create the tables (safe to run again)
npm run db:seed             # load the photos, artworks and events (safe to run again)
npm run dev                 # API on http://localhost:3000; restarts when you save
```

Other server commands: `npm run subscribers:sync` adds every account that has opted in to the Resend subscribers list (and creates the list the first time). New subscribers are added automatically, so you rarely need it.

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
| Events, dates and spots | `server/db/seed-data/events.js` then `npm run db:seed`. A price of `0` makes an event free (Reserve form); anything else is bought with Stripe |
| Menu links (and what's inside View ▾) | `my-react-app/src/data/navLinks.js` |
| What the Your Subscription page promises | The `whatYouGet` and `benefits` lists at the top of `my-react-app/src/pages/SubscriptionPage.jsx` |
| The wording of the automatic emails | `server/src/email.js` (new-subscriber notice and "You've unsubscribed") |
| Bulk emails to subscribers | The Resend dashboard → Broadcasts (see section 6 above) |
| What the order page says after paying | The `messages` object in `my-react-app/src/pages/OrderPage.jsx` |

Re-seeding updates titles, prices, images and so on, but never resets stock (`available`, `spots`), so it won't undo real bookings. To change stock, edit it in the Neon SQL editor.

## Deploying

Both the site and the API run on **Vercel**, as two projects. The site forwards every `/api/...` request to the API (`my-react-app/vercel.json`), so the browser only ever talks to the site's address. The sign-in cookie is then a normal first-party cookie, which browsers don't block.

| Part | Where | Address |
|---|---|---|
| Database | Neon, project `snowy-river-22482224`, branch `production` | `server/neon.ts` |
| API | Vercel, project `aurora-photography-api` (team the-blu-vibe), Express, from `server/` | https://aurora-photography-api.vercel.app |
| Site | Vercel, project `aurora-photography` (team the-blu-vibe), from `my-react-app/` | https://aurora-photography-roan.vercel.app |
| Payments | Stripe, **test mode** | Webhook → `https://aurora-photography-api.vercel.app/api/webhooks/stripe` |

The API used to run on Railway (project `aurora-photography`, service `api`). It moved to Vercel when Railway's deploys were paused. To move it back, change the address in `my-react-app/vercel.json` and update the Stripe and Resend webhooks.

**Pushing to `main` deploys the site automatically.** The **API does not deploy on push** (it isn't connected to GitHub yet), so after changing anything in `server/`, deploy it yourself:

```bash
cd server && vercel deploy --prod            # the API (needs: npm i -g vercel, vercel login)
cd my-react-app && vercel deploy --prod      # the site, without pushing
```

To make the API deploy on push too: Vercel → `aurora-photography-api` → Settings → Git → connect the GitHub repo, with **Root Directory** `server`.

After changing the tables or the seed data, run `npm run db:migrate` / `npm run db:seed` in `server/` (they use the direct Neon connection from `server/.env`).

**API environment variables** (Vercel → `aurora-photography-api` → Settings → Environment Variables, *Production*):
- `DATABASE_URL` and `DATABASE_URL_UNPOOLED` (from `neon env pull`), and `BETTER_AUTH_SECRET`.
- `BETTER_AUTH_URL` and `CLIENT_ORIGINS`, both `https://aurora-photography-roan.vercel.app`.
- The Resend ones from section 8: `RESEND_API_KEY`, `EMAIL_FROM`, `MARKETING_NOTIFY_EMAIL`, `RESEND_SEGMENT_ID`, `RESEND_WEBHOOK_SECRET`.
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

Variables are only read when a deployment starts, so **redeploy after changing one**. If the site's address ever changes, update `BETTER_AUTH_URL` and `CLIENT_ORIGINS`, or sign-in will be refused with "Invalid origin" (and the "Subscribe again" button in emails would point to the old address).

**Stripe** (dashboard.stripe.com, **Test mode**): API keys under Developers → API keys. The webhook endpoint is listed in [section 7](#7-payments-stripe-checkout). If the API's address ever changes, update the endpoint.

**Resend** (resend.com, signed in as the site owner):
- **Domains:** `bluvibe.co.za`, verified. Its three DNS records (`resend._domainkey` TXT, `send` and `rsend` CNAMEs) live at Register Domain SA. Leave them in place, or emails from sam@bluvibe.co.za will be rejected.
- **Webhooks:** event `contact.updated`, pointing at `https://aurora-photography-api.vercel.app/api/webhooks/resend`. It was set up for the old Railway address (`https://api-production-09396.up.railway.app/api/webhooks/resend`), so update it in Resend if it still points there.
- **Audience:** the *Aurora Photography subscribers* segment.

## Fonts

[Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (headings) and [Inter](https://fonts.google.com/specimen/Inter) (body), loaded from Google Fonts.

## Next steps

- Email the photographer (and the customer) when a booking or purchase form is sent. Resend is already set up, so this is mostly new email templates in `server/src/email.js`.
- Take payments for artworks too (events already use Stripe), and email buyers a receipt when the webhook marks an order paid.
- Switch Stripe to live mode for real money (live keys, a live webhook endpoint, and a business profile in Stripe).
- Connect the API's Vercel project to GitHub so it deploys on push like the site.
- Save gallery likes to the account too (favourites are saved; likes still reset on refresh).
- An admin page for viewing bookings (for now, use the Neon dashboard's Tables view).
- Update `CODE-WALKTHROUGH.md`, which still explains the old HTML/CSS version.

## Credits

© 2026 Aurora Photography. Built by Sam Collins.
