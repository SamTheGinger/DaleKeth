import { useState } from 'react' // Remembers the star being chosen in the form.
import { apiFetch, useApi } from '../utils/api.js' // Loads the reviews and sends new ones.
import { authClient } from '../utils/authClient.js' // Who (if anyone) is signed in: only accounts can leave a review.
import { formatMonthYear } from '../utils/format.js' // '2026-09-14' -> "September 2026".
import useSubmit from '../utils/useSubmit.js' // Sends the form and remembers how it went.
import LoadState from './LoadState.jsx' // "Loading…" / error message while the reviews arrive.
import StarRating from './StarRating.jsx' // The five gold stars.
import { errorClasses, labelClasses, inputClasses, submitClasses, thankYouClasses } from './formStyles.js' // Shared form styles.

const STAR_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'] // STAR_WORDS[3] = 'Good'.

// The gold "pill" links shown to visitors who aren't signed in (the same look as in SubscribeSection).
const pillClasses = 'inline-block rounded-full bg-accent px-6 py-2.5 font-body font-semibold text-background transition-colors hover:bg-muted'

// The Testimonials section at the very bottom of the home page (below "Stay In The Loop"):
//   1. the overall star rating and how many reviews it's based on,
//   2. the six newest approved reviews (GET /api/testimonials),
//   3. a form for rating Aurora Photography and writing a review (POST /api/testimonials). Only signed-in
//      accounts get the form; everyone else is asked to create an account or sign in.
// New reviews don't appear straight away: the photographer approves them first (npm run testimonials in server/).
// The six sample reviews come from server/db/seed-data/testimonials.js.
function Testimonials() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user // The signed-in user, or undefined.
  const { data, error, isLoading } = useApi('/api/testimonials')

  const [rating, setRating] = useState(0) // The star clicked in the form (0 = none yet).
  const [hovered, setHovered] = useState(0) // The star the mouse is over, so the stars light up as you move along them.
  const shownStars = hovered || rating // While hovering, preview that rating; otherwise show the chosen one.

  // result = the saved review once the server has it (null until then), which swaps the form for the thank-you message.
  const { handleSubmit, isSending, error: sendError, result: sent } = useSubmit((form) =>
    apiFetch('/api/testimonials', { method: 'POST', body: { rating: Number(form.rating), message: form.message } }),
  )

  let formContent
  if (isPending) {
    formContent = <p className="mt-4 animate-pulse text-center font-body text-muted">Loading&hellip;</p>
  } else if (!user) {
    formContent = (
      <>
        <p className="mt-4 text-center font-body text-text">Only Aurora account holders can leave a review. It&rsquo;s free and takes a minute.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a href="#/signup" className={pillClasses}>Create an Account</a>
          <a href="#/signin" className="font-body font-semibold text-accent underline hover:text-muted">Sign In</a>
        </div>
      </>
    )
  } else if (sent) {
    formContent = (
      // role="status" makes screen readers announce the message when it appears.
      <div role="status" className={thankYouClasses}>
        <p className="text-xl text-accent">Thank you, {sent.name}!</p>
        <p className="mt-2">Your review has been sent. It will appear here once it has been approved.</p>
      </div>
    )
  } else {
    formContent = (
      <form onSubmit={handleSubmit}>
        {/* <fieldset> + <legend> group the five star buttons under one label for screen readers. */}
        <fieldset className="border-0 p-0">
          <legend className={labelClasses}>Your Rating:</legend>
          {/* Each star is a radio button (only one can be picked) hidden behind a ★ you can click.
              sr-only hides the real button but keeps it for keyboards and screen readers: Tab to it, then use the arrow keys. */}
          <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="cursor-pointer text-4xl leading-none" onMouseEnter={() => setHovered(star)}>
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  required // On a group of radio buttons, one "required" means "pick one before sending".
                  checked={rating === star}
                  onChange={() => setRating(star)}
                  className="peer sr-only"
                />
                {/* peer-focus-visible: a gold ring round the star while it has keyboard focus. */}
                <span
                  aria-hidden="true"
                  className={`rounded-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-accent ${star <= shownStars ? 'text-accent' : 'text-muted/40'}`}
                >
                  ★
                </span>
                <span className="sr-only">{`${star} ${star === 1 ? 'star' : 'stars'} (${STAR_WORDS[star]})`}</span>
              </label>
            ))}
            {/* The word for the rating, e.g. "Very good". aria-hidden: the hidden labels above already say it. */}
            <span aria-hidden="true" className="ml-3 font-body text-text">{STAR_WORDS[shownStars]}</span>
          </div>
        </fieldset>

        <label htmlFor="testimonial-message" className={labelClasses}>Your Review:</label>
        {/* rows = how many lines tall the box starts. resize-y = it can be dragged taller, but not wider. */}
        <textarea id="testimonial-message" name="message" rows={4} maxLength={600} placeholder="Tell us about your experience" required className={`${inputClasses} resize-y`} />
        {/* The review is posted under the account's name, so there's no name box. */}
        <p className="mt-2 font-body text-sm text-muted">Posting as <span className="text-text">{user.name}</span>. Reviews appear once they&rsquo;ve been approved.</p>

        {sendError && <p role="alert" className={errorClasses}>{sendError.message}</p>}

        <button type="submit" disabled={isSending} className={submitClasses}>
          {isSending ? 'Sending…' : 'Post Your Review'}
        </button>
      </form>
    )
  }

  return (
    // id="testimonials" lets a link (#testimonials) jump here.
    <section id="testimonials" className="mx-auto mb-12 w-full max-w-275 px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="mb-3 text-center text-2xl text-text sm:text-3xl md:text-4xl">
        Kind <span className="text-muted">Words.</span>
      </h2>

      <LoadState isLoading={isLoading} error={error}>
        {/* The overall rating, e.g. ★★★★★ 4.8 out of 5, from 6 reviews. */}
        <div className="mb-8 flex flex-col items-center gap-1 text-center sm:mb-10">
          <StarRating value={data?.average ?? 0} className="text-3xl" />
          <p className="font-body text-text">
            <span className="font-semibold text-accent">{(data?.average ?? 0).toFixed(1)}</span> out of 5, from {data?.count}{' '}
            {data?.count === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* The reviews: 1 column on phones, 2 on tablets, 3 on desktop. */}
        <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
          {data?.testimonials.map((t) => (
            // flex-col + mt-auto on the footer keeps every name at the bottom of its card, even when reviews differ in length.
            <li key={t.id} className="flex flex-col rounded-lg bg-surface p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] sm:p-6">
              <StarRating value={t.rating} className="text-xl" />
              {/* <blockquote> is the HTML element for a quote. The curly quotes are added by &ldquo; and &rdquo;. */}
              <blockquote className="mt-3 mb-4 font-body text-text italic">&ldquo;{t.message}&rdquo;</blockquote>
              <footer className="mt-auto font-body text-sm">
                <span className="block font-semibold text-accent">{t.name}</span>
                <span className="text-muted">{formatMonthYear(t.date)}</span>
              </footer>
            </li>
          ))}
        </ul>
      </LoadState>

      {/* Rating Aurora Photography, in the same narrow box as the booking form. */}
      <div className="mx-auto mt-10 w-full max-w-[560px] rounded-lg bg-surface p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] sm:mt-12 sm:p-8 md:p-12">
        <h3 className="mb-2 text-center text-xl text-text sm:text-2xl">
          Rate Aurora <span className="text-muted">Photography.</span>
        </h3>
        <p className="text-center font-body text-text">Had a shoot, bought a piece or came to an event? We&rsquo;d love to hear how it went.</p>
        {formContent}
      </div>
    </section>
  )
}

export default Testimonials // Lets HomePage.jsx load this with: import Testimonials from '../components/Testimonials.jsx'
