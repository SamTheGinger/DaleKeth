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
