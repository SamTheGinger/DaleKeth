import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import { CLIENT_ORIGINS } from './config.js'
import catalogRoutes from './routes/catalog.js'
import favoriteRoutes from './routes/favorites.js'
import bookingRoutes from './routes/bookings.js'
import subscriptionRoutes from './routes/subscription.js'
import orderRoutes from './routes/orders.js'
import { handleResendWebhook } from './routes/resendWebhook.js'
import { handleStripeWebhook } from './routes/stripeWebhook.js'

const app = express()

// Requests arrive via Vercel's proxy; trust X-Forwarded-* for client IP and protocol.
app.set('trust proxy', true)
app.use(cors({ origin: CLIENT_ORIGINS, credentials: true }))

// These handlers read the raw request body themselves (Better Auth parses its own input; the webhooks
// verify signatures against the exact bytes), so they must be mounted before express.json().
app.all('/api/auth/{*any}', toNodeHandler(auth))
app.post('/api/webhooks/resend', express.raw({ type: '*/*', limit: '100kb' }), handleResendWebhook)
app.post('/api/webhooks/stripe', express.raw({ type: '*/*', limit: '1mb' }), handleStripeWebhook)

app.use(express.json({ limit: '20kb' }))
app.use((req, res, next) => {
  req.body ??= {} // Express 5 leaves req.body undefined for empty requests.
  next()
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api', catalogRoutes)
app.use('/api', bookingRoutes)
app.use('/api', orderRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/subscription', subscriptionRoutes)

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))

// Client errors (HttpError) are returned as-is; anything else is logged and hidden behind a generic 500.
app.use((error, req, res, next) => {
  if (error.status && error.status < 500) {
    return res.status(error.status).json({ error: error.message })
  }
  console.error(error)
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' })
})

export default app
