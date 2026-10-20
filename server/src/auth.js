// Authentication (sign up, sign in, sessions) is handled by Better Auth.
// It stores users and sessions in our Postgres database, in tables it creates itself
// ("user", "session", "account", "verification"); see db/migrate.js.
// Passwords are hashed before they're saved, and the session is kept in an httpOnly cookie
// that JavaScript in the browser can't read.
import { betterAuth } from 'better-auth'
import { fromNodeHeaders } from 'better-auth/node'
import { pool } from './db.js'
import { BETTER_AUTH_URL, CLIENT_ORIGINS } from './config.js'

export const auth = betterAuth({
  database: pool,
  baseURL: BETTER_AUTH_URL, // The address the browser sees. Cookies are marked "Secure" when this is https.
  // BETTER_AUTH_SECRET is read from the environment automatically.
  trustedOrigins: CLIENT_ORIGINS, // Requests from any other website are refused.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true, // Signing up also signs you in.
  },
})

// Gives back { user, session } for the request's cookie, or null when nobody is signed in.
export function getSession(req) {
  return auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
}

// Express middleware for routes that need a signed-in user. Sets req.user, or answers 401.
export async function requireUser(req, res, next) {
  const session = await getSession(req)
  if (!session) {
    return res.status(401).json({ error: 'Please sign in first.' })
  }
  req.user = session.user
  next()
}

// Like requireUser, but lets visitors through. req.user is the user, or null.
export async function optionalUser(req, res, next) {
  const session = await getSession(req)
  req.user = session?.user ?? null
  next()
}
