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
