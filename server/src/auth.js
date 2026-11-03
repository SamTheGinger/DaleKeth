// Better Auth: email/password accounts with sessions stored in Postgres and sent as an httpOnly cookie.
// Better Auth owns the user, session, account and verification tables (created by db/migrate.js).
import { betterAuth } from 'better-auth'
import { fromNodeHeaders } from 'better-auth/node'
import { pool } from './db.js'
import { BETTER_AUTH_URL, CLIENT_ORIGINS } from './config.js'
import { addSubscriberToList, sendMarketingOptInEmail } from './email.js'

export const auth = betterAuth({
  database: pool,
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: CLIENT_ORIGINS,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      marketingOptIn: { type: 'boolean', required: false, defaultValue: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!user.marketingOptIn) return
          // Awaited because serverless functions may be frozen once the response is sent.
          // Failures are logged but never block sign-up.
          await Promise.all([
            sendMarketingOptInEmail(user).catch((error) => console.error('Marketing opt-in email failed:', error.message)),
            addSubscriberToList(user).catch((error) => console.error('Adding to subscribers list failed:', error.message)),
          ])
        },
      },
    },
  },
})

export function getSession(req) {
  return auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
}

// Middleware: sets req.user or responds 401.
export async function requireUser(req, res, next) {
  const session = await getSession(req)
  if (!session) {
    return res.status(401).json({ error: 'Please sign in first.' })
  }
  req.user = session.user
  next()
}

// Middleware: sets req.user to the signed-in user, or null for guests.
export async function optionalUser(req, res, next) {
  const session = await getSession(req)
  req.user = session?.user ?? null
  next()
}
