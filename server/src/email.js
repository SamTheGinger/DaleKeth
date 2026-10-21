// Emails, through Resend (resend.com). Used when someone opts in to marketing emails:
//   1. sendMarketingOptInEmail()  tells the photographer about the new subscriber.
//   2. addSubscriberToList()      adds them to the subscribers list (a Resend "segment").
// and when someone leaves a review: sendNewTestimonialEmail() asks the photographer to approve it.
// Bulk emails to that list are written and sent from the Resend dashboard (Broadcasts), which adds an
// unsubscribe link to every email and stops emailing anyone who unsubscribes.
import { Resend } from 'resend'
import { EMAIL_FROM, MARKETING_NOTIFY_EMAIL, RESEND_API_KEY, RESEND_SEGMENT_ID, SITE_URL } from './config.js'

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

// Names and emails are typed by visitors, so they're "escaped" before going into the email's HTML.
// Otherwise someone could sign up with a name like <a href="...">click me</a> and put a link in the email.
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

// Tells the photographer that someone wants marketing emails.
//   via 'signup'  ticked the box while creating their account (the default).
//   via 'button'  clicked Subscribe at the bottom of the home page later, while signed in.
export async function sendMarketingOptInEmail(user, { via = 'signup' } = {}) {
  if (!resend) {
    console.warn(`RESEND_API_KEY is not set, so no email was sent for new subscriber ${user.email}.`)
    return
  }
  const when = via === 'signup' ? user.createdAt : new Date() // When they opted in.
  const date = new Date(when).toLocaleString('en-ZA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Africa/Johannesburg' })
  const how =
    via === 'signup'
      ? 'created an account and ticked "Send me news, new work and event updates"'
      : 'clicked Subscribe on the home page (they already had an account)'

  // Resend gives back { data, error } instead of throwing, so we check error ourselves.
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: MARKETING_NOTIFY_EMAIL,
    replyTo: user.email, // Pressing "Reply" in your inbox writes straight to the new subscriber.
    subject: `New email subscriber: ${user.name}`,
    text: `${user.name} (${user.email}) ${how} on Aurora Photography.\nOpted in: ${date}`,
    html: `<p><strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}) ${escapeHtml(how)} on Aurora Photography.</p>
           <p>Opted in: ${escapeHtml(date)}</p>`,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  console.log(`Marketing opt-in email sent for ${user.email}.`)
}

// Adds one person to the subscribers list in Resend, so they get the bulk emails (Broadcasts).
// Safe to call again for the same person. By default it NEVER re-subscribes someone who clicked
// "unsubscribe" in an email: Resend remembers that on the contact, and we leave that choice alone.
// resubscribe: true is only for when the person themselves has just clicked Subscribe again on the site.
export async function addSubscriberToList(user, { segmentId = RESEND_SEGMENT_ID, resubscribe = false } = {}) {
  if (!resend || !segmentId) {
    console.warn(`RESEND_API_KEY or RESEND_SEGMENT_ID is not set, so ${user.email} was not added to the subscribers list.`)
    return 'skipped'
  }

  // Already a contact in Resend? Then only make sure they're in the list.
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

// Tells the photographer a new review is waiting for approval (see routes/testimonials.js).
export async function sendNewTestimonialEmail(user, testimonial) {
  if (!resend) {
    console.warn(`RESEND_API_KEY is not set, so no email was sent for new testimonial ${testimonial.id}.`)
    return
  }
  const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating)
  const approve = `npm run testimonials -- approve ${testimonial.id}`
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: MARKETING_NOTIFY_EMAIL,
    replyTo: user.email, // Pressing "Reply" writes straight to the reviewer.
    subject: `New review waiting for approval: ${stars} from ${user.name}`,
    text: `${user.name} (${user.email}) left a ${testimonial.rating}-star review on Aurora Photography:\n\n"${testimonial.message}"\n\nIt isn't on the site yet. To show it, run this in the server folder:\n${approve}\n(or "npm run testimonials" to see every review that's waiting).`,
    html: `<p><strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}) left a review on Aurora Photography:</p>
           <p style="font-size:20px;color:#d4a373">${stars}</p>
           <blockquote style="margin:0 0 16px;padding-left:12px;border-left:3px solid #d4a373">${escapeHtml(testimonial.message)}</blockquote>
           <p>It isn&rsquo;t on the site yet. To show it, run this in the server folder:</p>
           <p><code>${escapeHtml(approve)}</code></p>
           <p style="color:#777">Or run <code>npm run testimonials</code> to see every review that&rsquo;s waiting.</p>`,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  console.log(`New testimonial email sent for review ${testimonial.id}.`)
}

// Has this person clicked "unsubscribe" in one of the bulk emails? Resend keeps track of that.
// Gives back true or false, or null if we can't tell (Resend not set up, or they're not a contact there).
export async function hasUnsubscribedInResend(email) {
  if (!resend) return null
  const { data } = await resend.contacts.get(email)
  return data ? Boolean(data.unsubscribed) : null
}

// Marks someone as unsubscribed in Resend, so no bulk emails (Broadcasts) go to them.
export async function unsubscribeInResend(email) {
  if (!resend) return
  const { error } = await resend.contacts.update({ email, unsubscribed: true })
  if (error && !/not found/i.test(error.message)) throw new Error(`Resend: ${error.message}`)
}

// Confirms to the person that they've unsubscribed, with a button to subscribe again if they change their mind.
// Sent whether they unsubscribed on the website or with the link at the bottom of one of the bulk emails.
export async function sendUnsubscribedEmail(user) {
  if (!resend) {
    console.warn(`RESEND_API_KEY is not set, so no unsubscribe confirmation was sent to ${user.email}.`)
    return
  }
  const resubscribeUrl = `${SITE_URL}/#/subscription` // The "Your Subscription" page, which has a Subscribe button.
  const greeting = user.name ? `Hi ${user.name},` : 'Hi,'
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: user.email,
    replyTo: MARKETING_NOTIFY_EMAIL, // A reply reaches the photographer.
    subject: 'You’ve unsubscribed from Aurora Photography emails',
    text: `${greeting}\n\nYou've been unsubscribed, so you won't get any more news, new work or event updates from Aurora Photography.\n\nChanged your mind? Subscribe again here: ${resubscribeUrl}\n\nAurora Photography`,
    html: `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#222;max-width:520px">
      <p>${escapeHtml(greeting)}</p>
      <p>You&rsquo;ve been unsubscribed, so you won&rsquo;t get any more news, new work or event updates from Aurora Photography.</p>
      <p>Changed your mind? You can subscribe again at any time:</p>
      <p><a href="${resubscribeUrl}" style="display:inline-block;background:#d4a373;color:#111;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Subscribe again</a></p>
      <p style="color:#777;font-size:14px">Aurora Photography &middot; Durban, South Africa</p>
    </div>`,
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  console.log(`Unsubscribe confirmation sent to ${user.email}.`)
}
