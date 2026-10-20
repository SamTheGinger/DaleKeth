// Sending emails, through Resend (resend.com). Used by auth.js when a new account opts in to marketing.
//
// The "from" address is Resend's shared test sender (onboarding@resend.dev). That works without
// setting up a domain, but ONLY for sending to the email address the Resend account belongs to,
// which is fine here: these emails only ever go to the photographer (MARKETING_NOTIFY_EMAIL).
import { Resend } from 'resend'
import { MARKETING_NOTIFY_EMAIL, RESEND_API_KEY } from './config.js'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null
const FROM = 'Aurora Photography <onboarding@resend.dev>'

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
    from: FROM,
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
