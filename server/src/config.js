// Environment configuration. Required variables fail fast at startup; optional integrations
// (Resend, Stripe) degrade gracefully when their keys are absent.
import 'dotenv/config'

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

// Comma-separated list of origins allowed to make credentialed requests.
export const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || BETTER_AUTH_URL)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// Public site URL, used to build links in outgoing emails and Stripe redirect URLs.
export const SITE_URL = BETTER_AUTH_URL.replace(/\/$/, '')

// Resend (email)
export const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
export const RESEND_SEGMENT_ID = process.env.RESEND_SEGMENT_ID || ''
export const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || ''
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Aurora Photography <onboarding@resend.dev>'
export const MARKETING_NOTIFY_EMAIL = process.env.MARKETING_NOTIFY_EMAIL || 'sam@bluvibe.co.za'

// Stripe (payments)
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
