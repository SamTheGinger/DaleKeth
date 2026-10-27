// Reads settings from environment variables (the .env file locally, Railway's Variables tab in production)
// and stops the server early with a clear message if a required one is missing.
import 'dotenv/config' // Loads .env into process.env. Does nothing if there's no .env file (as on Railway).

function required(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy server/.env.example to server/.env and fill it in.`)
  }
  return value
}

export const DATABASE_URL = required('DATABASE_URL')
export const BETTER_AUTH_URL = required('BETTER_AUTH_URL')
export const PORT = Number(process.env.PORT) || 3000

// "https://a.com, https://b.com" -> ['https://a.com', 'https://b.com']
export const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || BETTER_AUTH_URL)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// Emails (see src/email.js). RESEND_API_KEY is optional: without it the server still runs,
// it just logs that it skipped the email instead of sending it.
export const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
// Who gets told when a new account ticks "Send me news and offers".
export const MARKETING_NOTIFY_EMAIL = process.env.MARKETING_NOTIFY_EMAIL || 'sam@bluvibe.co.za'
// The sender for emails the server sends. Until bluvibe.co.za is verified in Resend, only Resend's
// test sender (onboarding@resend.dev) works; after that, set EMAIL_FROM to "Sam <sam@bluvibe.co.za>".
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Aurora Photography <onboarding@resend.dev>'
// The Resend segment (mailing list) that opted-in accounts are added to. `npm run subscribers:sync`
// creates it the first time and prints the id to put here.
export const RESEND_SEGMENT_ID = process.env.RESEND_SEGMENT_ID || ''
// The website's address, for links inside emails (e.g. "Subscribe again"). It's the same address people
// open the site at, which Better Auth already needs, so it's reused here.
export const SITE_URL = BETTER_AUTH_URL.replace(/\/$/, '')
// The secret Resend uses to sign its webhook calls (Resend → Webhooks), so we can check they're genuine.
export const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || ''
// Stripe (stripe.com), for paying for artworks with Stripe Checkout. Use the TEST keys (sk_test_...): the money is fake.
// STRIPE_SECRET_KEY is from Stripe → Developers → API keys. STRIPE_WEBHOOK_SECRET (whsec_...) is printed by
// `stripe listen` locally, or shown on the webhook endpoint you add in Stripe for the live site.
// Both are optional: without them the server still runs, and Buy Now answers "Payments aren't set up yet".
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
