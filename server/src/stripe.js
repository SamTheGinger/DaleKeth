import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from './config.js'

// Null when Stripe isn't configured; payment routes respond 503 in that case.
export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null
