// Transactional email and subscriber-list management via Resend.
// Bulk marketing emails are composed and sent from the Resend dashboard (Broadcasts) to RESEND_SEGMENT_ID,
// which also handles unsubscribe links; routes/resendWebhook.js syncs those unsubscribes back to our database.
import { Resend } from 'resend'
import { EMAIL_FROM, MARKETING_NOTIFY_EMAIL, RESEND_API_KEY, RESEND_SEGMENT_ID, SITE_URL } from './config.js'

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

const ACCENT = '#d4a373'

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

const randFormatter = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })
const formatRand = (amount) => randFormatter.format(amount)
const formatEventDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const formatSpots = (quantity) => `${quantity} ${quantity === 1 ? 'spot' : 'spots'}`

// Branded wrapper for customer-facing emails. `body` must already be escaped.
function layout(body) {
  return `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#222;max-width:520px">
      ${body}
      <p style="color:#777;font-size:14px">Aurora Photography &middot; Durban, South Africa</p>
    </div>`
}

function button(href, label) {
  return `<p><a href="${href}" style="display:inline-block;background:${ACCENT};color:#111;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">${label}</a></p>`
}

// Sends one email. Resend returns { error } rather than throwing, so normalise that into an exception.
// When Resend isn't configured the email is skipped with a warning, so local development works without a key.
async function send(description, message) {
  if (!resend) {
    console.warn(`RESEND_API_KEY is not set; skipped ${description}.`)
    return
  }
  const { error } = await resend.emails.send({ from: EMAIL_FROM, ...message })
  if (error) throw new Error(`Resend: ${error.message}`)
  console.log(`Sent ${description}.`)
}

// ---------------------------------------------------------------------------
// Marketing subscriptions
// ---------------------------------------------------------------------------

// Notifies the photographer of a new subscriber. `via` is 'signup' (checkbox on registration)
// or 'button' (an existing account subscribing later).
export async function sendMarketingOptInEmail(user, { via = 'signup' } = {}) {
  const when = via === 'signup' ? user.createdAt : new Date()
  const date = new Date(when).toLocaleString('en-ZA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Johannesburg' })
  const how =
    via === 'signup'
      ? 'created an account and ticked "Send me news, new work and event updates"'
      : 'clicked Subscribe on the home page (they already had an account)'

  await send(`opt-in notification for ${user.email}`, {
    to: MARKETING_NOTIFY_EMAIL,
    replyTo: user.email,
    subject: `New email subscriber: ${user.name}`,
    text: `${user.name} (${user.email}) ${how} on Aurora Photography.\nOpted in: ${date}`,
    html: `<p><strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}) ${escapeHtml(how)} on Aurora Photography.</p>
           <p>Opted in: ${escapeHtml(date)}</p>`,
  })
}

// Confirms an unsubscribe (from the site or a Broadcast link) and offers a way back.
export async function sendUnsubscribedEmail(user) {
  const resubscribeUrl = `${SITE_URL}/#/subscription`
  const greeting = user.name ? `Hi ${user.name},` : 'Hi,'

  await send(`unsubscribe confirmation to ${user.email}`, {
    to: user.email,
    replyTo: MARKETING_NOTIFY_EMAIL,
    subject: 'You’ve unsubscribed from Aurora Photography emails',
    text: `${greeting}\n\nYou've been unsubscribed, so you won't get any more news, new work or event updates from Aurora Photography.\n\nChanged your mind? Subscribe again here: ${resubscribeUrl}\n\nAurora Photography`,
    html: layout(`
      <p>${escapeHtml(greeting)}</p>
      <p>You&rsquo;ve been unsubscribed, so you won&rsquo;t get any more news, new work or event updates from Aurora Photography.</p>
      <p>Changed your mind? You can subscribe again at any time:</p>
      ${button(resubscribeUrl, 'Subscribe again')}`),
  })
}

// Adds a user to the subscribers segment. Idempotent. Contacts who unsubscribed via a Broadcast link
// are left alone unless `resubscribe` is set, which is only done when the user explicitly opts back in.
// Returns a short status string (used by db/sync-subscribers.js for reporting).
export async function addSubscriberToList(user, { segmentId = RESEND_SEGMENT_ID, resubscribe = false } = {}) {
  if (!resend || !segmentId) {
    console.warn(`RESEND_API_KEY or RESEND_SEGMENT_ID is not set; ${user.email} was not added to the subscribers list.`)
    return 'skipped'
  }

  const existing = await resend.contacts.get(user.email)
  if (existing.data) {
    if (existing.data.unsubscribed) {
      if (!resubscribe) return 'unsubscribed earlier, left alone'
      const { error } = await resend.contacts.update({ email: user.email, unsubscribed: false })
      if (error) throw new Error(`Resend: ${error.message}`)
    }
    const { error } = await resend.contacts.segments.add({ email: user.email, segmentId })
    if (error && !/already/i.test(error.message)) throw new Error(`Resend: ${error.message}`)
    return existing.data.unsubscribed ? 're-subscribed' : 'already a contact, on the list'
  }

  const { error } = await resend.contacts.create({
    email: user.email,
    firstName: user.name,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  return 'added'
}

// true / false, or null when unknown (Resend not configured, or no such contact).
export async function hasUnsubscribedInResend(email) {
  if (!resend) return null
  const { data } = await resend.contacts.get(email)
  return data ? Boolean(data.unsubscribed) : null
}

export async function unsubscribeInResend(email) {
  if (!resend) return
  const { error } = await resend.contacts.update({ email, unsubscribed: true })
  if (error && !/not found/i.test(error.message)) throw new Error(`Resend: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Orders (called from routes/stripeWebhook.js once an order is paid)
//   order  { id, total, name, email }
//   items  [{ title, quantity, unitPrice, eventId, date: 'YYYY-MM-DD', time, venue }]
// ---------------------------------------------------------------------------

export async function sendOrderConfirmationEmail(order, items) {
  const orderUrl = `${SITE_URL}/#/order/${order.id}`
  const greeting = order.name ? `Hi ${order.name},` : 'Hi,'

  const itemsText = items
    .map((i) => `${i.title}\n${formatEventDate(i.date)}, ${i.time}\n${i.venue}\n${formatSpots(i.quantity)} × ${formatRand(i.unitPrice)}`)
    .join('\n\n')
  const itemsHtml = items
    .map(
      (i) => `<div style="margin:0 0 16px;padding:16px;border-left:3px solid ${ACCENT};background:#faf6f1">
        <p style="margin:0;font-size:18px;font-weight:bold">${escapeHtml(i.title)}</p>
        <p style="margin:6px 0 0">${escapeHtml(formatEventDate(i.date))}, ${escapeHtml(i.time)}<br>${escapeHtml(i.venue)}</p>
        <p style="margin:6px 0 0">${escapeHtml(formatSpots(i.quantity))} &times; ${escapeHtml(formatRand(i.unitPrice))}</p>
      </div>`,
    )
    .join('')

  await send(`order confirmation for order ${order.id}`, {
    to: order.email,
    replyTo: MARKETING_NOTIFY_EMAIL,
    subject: `Your spots are confirmed: ${items.map((i) => i.title).join(', ')}`,
    text: `${greeting}\n\nThank you! Your payment has been received and your spots are confirmed.\n\n${itemsText}\n\nTotal paid: ${formatRand(order.total)}\nOrder #${order.id}\n\nSee your order: ${orderUrl}\n\nQuestions? Just reply to this email.\n\nAurora Photography`,
    html: layout(`
      <p>${escapeHtml(greeting)}</p>
      <p>Thank you! Your payment has been received and your spots are confirmed.</p>
      ${itemsHtml}
      <p style="margin:0">Total paid: <strong>${escapeHtml(formatRand(order.total))}</strong><br>
        <span style="color:#777;font-size:14px">Order #${order.id}</span></p>
      ${button(orderUrl, 'View your order')}
      <p>Questions? Just reply to this email.</p>`),
  })
}

export async function sendNewOrderEmail(order, items) {
  const lines = items.map((i) => `${formatSpots(i.quantity)} for ${i.title} (${formatEventDate(i.date)})`)

  await send(`new-order notification for order ${order.id}`, {
    to: MARKETING_NOTIFY_EMAIL,
    replyTo: order.email,
    subject: `New order: ${lines.join(', ')}`,
    text: `${order.name} (${order.email}) paid ${formatRand(order.total)} for:\n${lines.map((l) => `- ${l}`).join('\n')}\n\nOrder #${order.id}`,
    html: `<p><strong>${escapeHtml(order.name)}</strong> (${escapeHtml(order.email)}) paid <strong>${escapeHtml(formatRand(order.total))}</strong> for:</p>
           <ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
           <p style="color:#777">Order #${order.id}</p>`,
  })
}
