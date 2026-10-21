// Builds the Express app: which middleware runs, and which routes answer which addresses.
import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import { CLIENT_ORIGINS } from './config.js'
import catalogRoutes from './routes/catalog.js'
import favoriteRoutes from './routes/favorites.js'
import bookingRoutes from './routes/bookings.js'
import subscriptionRoutes from './routes/subscription.js'
import testimonialRoutes from './routes/testimonials.js'
import { handleResendWebhook } from './routes/resendWebhook.js'

const app = express()

// Railway (and Vercel's /api forwarding) sit in front of this server. This tells Express to trust
// their X-Forwarded-* headers, so it knows the visitor's real IP address and that they used https.
app.set('trust proxy', true)

// CORS: which other websites may call this API from the browser, with cookies.
// In production the frontend calls /api through Vercel (same site), so this mainly matters for direct calls.
app.use(cors({ origin: CLIENT_ORIGINS, credentials: true }))

// Better Auth answers everything under /api/auth (sign-up, sign-in, sign-out, get-session).
// It must come BEFORE express.json(), because it reads the request body itself.
app.all('/api/auth/{*any}', toNodeHandler(auth))

// Resend's webhook (someone unsubscribed from a bulk email). It needs the body exactly as it arrived to check
// the signature, so it gets express.raw() and must come BEFORE express.json() below.
app.post('/api/webhooks/resend', express.raw({ type: '*/*', limit: '100kb' }), handleResendWebhook)

app.use(express.json({ limit: '20kb' })) // Turns JSON request bodies into req.body.
app.use((req, res, next) => {
  req.body ??= {} // Express 5 leaves req.body undefined when nothing was sent; an empty object is easier to check.
  next()
})

// A quick "are you alive?" check for Railway and for you: open /api/health in the browser.
app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api', catalogRoutes)
app.use('/api', bookingRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/testimonials', testimonialRoutes)

// Any other /api address.
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))

// Error handler: Express sends any error thrown in a route here (it has 4 inputs, which is how Express knows).
// Our own HttpErrors carry a status and a friendly message. Anything else is a bug: log it and say 500,
// without sending the details (they could reveal how the server works).
app.use((error, req, res, next) => {
  if (error.status && error.status < 500) {
    return res.status(error.status).json({ error: error.message })
  }
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' })
})

export default app
