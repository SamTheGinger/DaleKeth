// Emails, through Resend (resend.com). Used by auth.js when a new account ticks the marketing box:
//   1. sendMarketingOptInEmail()  tells the photographer about the new subscriber.
//   2. addSubscriberToList()      adds them to the subscribers list (a Resend "segment").
// Bulk emails to that list are written and sent from the Resend dashboard (Broadcasts), which adds an
// unsubscribe link to every email and stops emailing anyone who unsubscribes.
import { Resend } from 'resend'
import { EMAIL_FROM, MARKETING_NOTIFY_EMAIL, RESEND_API_KEY, RESEND_SEGMENT_ID } from './config.js'

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

// Names and emails are typed by visitors, so they're "escaped" before going into the email's HTML.
// Otherwise someone could sign up with a name like <a href="...">click me</a> and put a link in the email.
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

// Tells the photographer that a new account wants marketing emails.
export async function sendMarketingOptInEmail(user) {
  if (!resend) {
    console.warn(`RESEND_API_KEY is not set, so no email was sent for new subscriber ${user.email}.`)
    return
  }
  const date = new Date(user.createdAt).toLocaleString('en-ZA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Johannesburg' })

  // Resend gives back { data, error } instead of throwing, so we check error ourselves.
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: MARKETING_NOTIFY_EMAIL,
    replyTo: user.email, // Pressing "Reply" in your inbox writes straight to the new subscriber.
    subject: `New email subscriber: ${user.name}`,
    text: `${user.name} (${user.email}) created an account and ticked "Send me news and offers" on ${date}.`,
    html: `<p><strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}) created an account on Aurora Photography
           and ticked <em>&ldquo;Send me news and offers&rdquo;</em>.</p><p>Opted in: ${escapeHtml(date)}</p>`,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  console.log(`Marketing opt-in email sent for ${user.email}.`)
}

// Adds one person to the subscribers list in Resend, so they get the bulk emails (Broadcasts).
// Safe to call again for the same person. It NEVER re-subscribes someone who clicked "unsubscribe"
// in an email: Resend remembers that on the contact, and we leave existing contacts' choice alone.
export async function addSubscriberToList(user, segmentId = RESEND_SEGMENT_ID) {
  if (!resend || !segmentId) {
    console.warn(`RESEND_API_KEY or RESEND_SEGMENT_ID is not set, so ${user.email} was not added to the subscribers list.`)
    return 'skipped'
  }

  // Already a contact in Resend? Then only make sure they're in the list; don't change "unsubscribed".
  const existing = await resend.contacts.get(user.email)
  if (existing.data) {
    if (existing.data.unsubscribed) return 'unsubscribed earlier, left alone'
    const { error } = await resend.contacts.segments.add({ email: user.email, segmentId })
    if (error && !/already/i.test(error.message)) throw new Error(`Resend: ${error.message}`)
    return 'already a contact, on the list'
  }

  // New to Resend: create them, straight into the list.
  const { error } = await resend.contacts.create({
    email: user.email,
    firstName: user.name,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  return 'added'
}
