// The Stripe client, shared by the checkout route (routes/orders.js) and the webhook (routes/stripeWebhook.js).
// It's null when STRIPE_SECRET_KEY isn't set, so the rest of the site still works without Stripe.
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from './config.js'

export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null
