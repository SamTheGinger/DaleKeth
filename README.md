# Aurora Photography

Portfolio, art shop and event-booking platform for a Durban-based portrait and landscape photographer.

**Live:** [aurora-photography-roan.vercel.app](https://aurora-photography-roan.vercel.app) · **API health:** [aurora-photography-api.vercel.app/api/health](https://aurora-photography-api.vercel.app/api/health)

| Layer    | Technology |
|----------|------------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend  | Node.js 22, Express 5 |
| Database | PostgreSQL (Neon) via `pg` |
| Auth     | Better Auth (email/password, httpOnly session cookies) |
| Payments | Stripe Checkout (test mode) |
| Email    | Resend (transactional + Broadcasts) |
| Hosting  | Vercel (two projects: site and API) |

## Features

- Filterable portfolio with per-series gallery pages; favourites persisted per account
- Artwork shop with purchase requests, and event pages with spot selection
- Paid events purchased through Stripe Checkout, confirmed by a signed webhook, with email receipts
- Free events reserved directly, with concurrency-safe stock decrement
- Photoshoot booking form
- Accounts with an opt-in marketing list synced to Resend, including unsubscribe handling in both directions
- Mobile-first, accessible UI (ARIA states, keyboard navigation, reduced layout shift)

## Architecture

```
Browser ──/api/*──▶ Vercel: site (my-react-app) ──rewrite──▶ Vercel: API (server) ──SQL──▶ Neon Postgres
   │                                                              ▲   ▲
   └──── redirect to Stripe Checkout ──▶ Stripe ─── webhook ──────┘   └── webhook ─── Resend
```

The browser only ever talks to the site's origin. `my-react-app/vercel.json` rewrites `/api/*` to the API project, and `vite.config.js` does the same in development. As a result the Better Auth session cookie is first-party and unaffected by third-party cookie blocking.

**Trust boundaries.** The client chooses *what* (event id, quantity); the server decides *how much*. Prices are always read from the database. Orders move to `paid` only through the signature-verified Stripe webhook, never because the user reached the success URL.

### Project layout

```
my-react-app/                 Frontend (Vite)
  src/
    App.jsx                   Route switch, favourites state, anchor scrolling
    pages/                    Route-level views (gallery, artwork, event, order, auth, subscription)
    components/               Home-page sections and shared UI
    data/navLinks.js          Navigation definition
    utils/
      api.js                  fetch wrapper + useApi (cached, deduplicated)
      authClient.js           Better Auth React client
      useHashRoute.js         Hash router (#/gallery/3, #portfolio)
      useSubmit.js            Form submission state
      useSubscriptionStatus.js
      returnTo.js             Post-sign-in redirect
      format.js               Currency, date, pluralisation
  public/Images/              Optimised WebP assets (the database stores their paths)
  vercel.json                 /api rewrite to the API project

server/                       API (Express, deployed as a Vercel function)
  src/
    app.js                    Middleware order, route mounting, error handler
    config.js                 Environment parsing (fails fast on missing required vars)
    db.js                     pg Pool, query(), transaction()
    auth.js                   Better Auth config, requireUser / optionalUser middleware
    email.js                  Resend: templates and subscriber-list management
    stripe.js                 Stripe client
    validate.js               Input validation, HttpError
    routes/
      catalog.js              Public read endpoints
      bookings.js             Form submissions (free-event reservations, purchase requests, photoshoots)
      orders.js               Stripe checkout + order lookup
      favorites.js
      subscription.js
      stripeWebhook.js        Only path that marks orders paid
      resendWebhook.js        Syncs Broadcast unsubscribes
  db/
    schema.sql                Application tables
    migrate.js                Better Auth tables, then schema.sql
    seed.js, seed-data/       Catalogue content
    sync-subscribers.js       Backfill opted-in users into Resend
```

## Getting started

**Prerequisites:** Node.js 22+, a [Neon](https://neon.tech) database. Resend and Stripe keys are optional. Without them, emails are skipped with a log warning and checkout returns 503.

```bash
# API: http://localhost:3000
cd server
npm install
cp .env.example .env        # set DATABASE_URL, DATABASE_URL_UNPOOLED, BETTER_AUTH_SECRET
npm run db:migrate
npm run db:seed
npm run dev

# Frontend: http://localhost:5173 (proxies /api to :3000)
cd my-react-app
npm install
npm run dev
```

| Package        | Script | Purpose |
|----------------|--------|---------|
| `server`       | `dev` / `start` | Run the API (watch mode / production) |
|                | `db:migrate` | Create or update all tables (idempotent) |
|                | `db:seed` | Upsert catalogue content (idempotent; never resets stock) |
|                | `subscribers:sync` | Backfill opted-in users into the Resend segment |
| `my-react-app` | `dev` / `build` / `preview` | Vite |
|                | `lint` | Oxlint |

### Environment variables (`server/.env`)

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DATABASE_URL` | ✓ | Neon **pooled** connection string (runtime) |
| `DATABASE_URL_UNPOOLED` | | Neon **direct** connection string. Used by `db/` scripts, because the pooler breaks DDL and `setval` |
| `BETTER_AUTH_SECRET` | ✓ | Session-signing secret |
| `BETTER_AUTH_URL` | ✓ | Public site URL. Also used for email links and Stripe redirects |
| `CLIENT_ORIGINS` | | Comma-separated trusted origins (defaults to `BETTER_AUTH_URL`) |
| `PORT` | | Local port (default `3000`) |
| `RESEND_API_KEY` | | Full-access key (manages contacts, not just sending) |
| `EMAIL_FROM` | | Sender, e.g. `Aurora Photography <sam@bluvibe.co.za>` |
| `MARKETING_NOTIFY_EMAIL` | | Receives new-subscriber and new-order notifications |
| `RESEND_SEGMENT_ID` | | Subscribers segment. `subscribers:sync` creates it on first run |
| `RESEND_WEBHOOK_SECRET` | | Verifies `/api/webhooks/resend` |
| `STRIPE_SECRET_KEY` | | `sk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | | `whsec_…`. Locally, use the one printed by `stripe listen` |

## API

| Method & path | Auth | Description |
|---------------|------|-------------|
| `GET /api/health` | | Liveness check |
| `GET /api/photos`, `/api/photos/:id` | | Portfolio series with ordered gallery |
| `GET /api/artworks`, `/api/artworks/:id` | | Shop catalogue |
| `GET /api/events`, `/api/events/:id` | | Events (list returns upcoming only) |
| `POST /api/artworks/:id/purchase-requests` | optional | `{ quantity, name, email }` |
| `POST /api/events/:id/bookings` | optional | Free events only: `{ spots, name, email, phone }` → `{ spotsLeft, … }` |
| `POST /api/photoshoot-bookings` | optional | `{ name, email, phone, style }` |
| `POST /api/checkout` | required | Paid events: `{ eventId, spots }` → `{ url }` |
| `GET /api/orders/:id` | required | Caller's own order with line items |
| `GET /api/favorites` | required | `[photoId, …]` |
| `PUT` / `DELETE /api/favorites/:photoId` | required | Idempotent add / remove |
| `GET` / `POST` / `DELETE /api/subscription` | required | Read / subscribe / unsubscribe |
| `POST /api/webhooks/stripe` | Stripe signature | `checkout.session.completed`, `.async_payment_succeeded`, `.expired` |
| `POST /api/webhooks/resend` | Resend signature | `contact.updated` |
| `/api/auth/*` | | Better Auth (`sign-up/email`, `sign-in/email`, `sign-out`, `get-session`) |

Errors are returned as `{ "error": "message" }` with an appropriate status. Unexpected errors are logged server-side and returned as a generic 500.

## Data model

Better Auth owns `user`, `session`, `account` and `verification`. `user` is extended with a `marketingOptIn` boolean, which is exposed on the session so the UI can read it without an extra request.

```
user ──< favorites >── photos ──< photo_images
user ──< orders ──< order_items >── events
user ─?< purchase_requests >── artworks          (?: nullable; guests allowed)
user ─?< event_bookings >── events
user ─?< photoshoot_bookings
```

Key constraints:
- `events.spots` and `artworks.available` have `CHECK (>= 0)`. Stock is decremented with a conditional `UPDATE … WHERE spots >= $n`, so concurrent requests can't oversell.
- `order_items` snapshots `title` and `unit_price`, so later catalogue edits don't alter historical orders.
- `orders.user_id` has no cascade, so accounts with purchase history can't be deleted accidentally.

## Payments flow

1. `POST /api/checkout` validates the event (upcoming, paid, in stock). Then, in a single transaction, it inserts a `pending` order and its line item and creates a Stripe Checkout Session with `metadata.orderId`. If Stripe fails, the transaction rolls back.
2. The browser redirects to Stripe. On success, Stripe redirects to `#/order/:id` and, independently, calls the webhook.
3. The webhook verifies the signature, then runs `UPDATE orders SET status = 'paid' … WHERE status = 'pending'` and decrements event spots in one transaction. The status guard makes redelivery a no-op. Confirmation emails are sent only by the call that performed the transition.
4. `OrderPage` polls `GET /api/orders/:id` (6 × 2 s) to cover the redirect/webhook race, then offers a manual re-check.

Abandoned sessions expire after 24 h (`checkout.session.expired` → `expired`). Stock is only taken on payment, so expired orders never hold inventory. If two buyers pay for the last spot simultaneously, both orders remain paid and a warning is logged for a manual refund.

**Local testing:**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # copy the whsec_… into server/.env
```

Pay with card `4242 4242 4242 4242`, any future expiry and any CVC.

## Email subscriptions

Opt-in is explicit (unchecked by default, per POPIA). Subscribing happens at sign-up, via the home-page prompt, or on `#/subscription`. Each path sets `user.marketingOptIn`, adds the contact to the Resend segment, and notifies the photographer.

Unsubscribing can start on either side:
- **On the site:** `DELETE /api/subscription` updates the database *first*, then Resend, then sends a confirmation.
- **From a Broadcast link:** Resend fires `contact.updated` and the webhook updates the account and sends the same confirmation. It only acts if the account is still subscribed, so a site-initiated unsubscribe never produces a duplicate email.

`GET /api/subscription` also reconciles against Resend, which covers a missed webhook. A user who unsubscribed via email is never re-added automatically; only an explicit subscribe action overrides it.

Bulk emails are composed and sent from the Resend dashboard (Broadcasts → segment *Aurora Photography subscribers*).

## Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| Site | Vercel project `aurora-photography`, root `my-react-app/` | Deploys automatically on push to `main` |
| API | Vercel project `aurora-photography-api`, root `server/` | **Not Git-connected.** Deploy with `vercel deploy --prod` from `server/` |
| Database | Neon project `snowy-river-22482224`, branch `production` | Run `db:migrate` / `db:seed` locally against it |
| Stripe | Test mode | Webhook → `https://aurora-photography-api.vercel.app/api/webhooks/stripe` |
| Resend | Domain `bluvibe.co.za` (DNS at Register Domain SA) | Webhook → `https://aurora-photography-api.vercel.app/api/webhooks/resend`, event `contact.updated` |

Production environment variables live in each Vercel project's settings. They are read at deploy time, so **redeploy after changing them**. `BETTER_AUTH_URL` and `CLIENT_ORIGINS` must both equal the site URL, or sign-in fails with "Invalid origin".

## Roadmap

- Connect the API project to GitHub for push-to-deploy
- Stripe payments for artworks; switch Stripe to live mode
- Email notifications for form submissions
- Persist gallery likes per account
- Admin view for bookings and orders

## Credits

© 2026 Aurora Photography. Built by Sam Collins. Typography: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) and [Inter](https://fonts.google.com/specimen/Inter).
