import { useState } from 'react' // useState lets this page remember the number of spots and whether the form was sent.
import QuantityStepper from '../components/QuantityStepper.jsx' // The − 1 + control.
import { formatDate, formatPrice } from '../utils/format.js' // Nicely written dates and prices.
import { inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js' // Shared form styles.

// The page that opens when "Book a spot" is clicked on an event.
// It shows the event details, lets the visitor choose how many spots they want,
// and has a form to book them.
//
// NOTE: like the other forms, this doesn't send anywhere yet; it only shows a thank-you message.
// To receive bookings you'd connect a form service (for example Formspree) or a ticketing service.
//
// Props (input from App.jsx):
//   event  the event object for this page (from data/events.js).
function EventPage({ event }) {
  const [spots, setSpots] = useState(1) // How many spots to book. Starts at 1.
  const [guest, setGuest] = useState(null) // Who booked. null = form not sent yet.

  // At most 10 spots per booking, or fewer if there aren't 10 left.
  // Math.min() gives back the smaller of the numbers it's given.
  const maxSpots = Math.min(10, event.spots)
  const isFree = event.price === 0 // true for free events, so we can say "Free" instead of "R 0".

  // Runs when the booking form is sent.
  function handleSubmit(formEvent) {
    formEvent.preventDefault() // Stop the browser reloading the page.
    const formData = new FormData(formEvent.target) // Collects everything typed into the form.
    setGuest({ name: formData.get('name'), email: formData.get('email') }) // Remember who booked, which shows the thank-you message.
  }

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12">
      <a href="#events" className="font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Back to events
      </a>

      {/* The event's image as a wide banner. aspect-[21/9] = very wide on phones; md:aspect-[3/1] = even wider from 900px. */}
      <img src={event.src} alt="" className="mt-6 aspect-[21/9] w-full rounded-3xl border-2 border-accent object-cover md:aspect-[3/1]" />

      {/* Mobile-first: details and form are stacked on phones; from 900px (md:) the details sit on
          the left (wider: 3fr) and the form on the right (narrower: 2fr). */}
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
        <div className="min-w-0">
          <p className="font-body text-sm font-semibold tracking-wider text-accent uppercase">
            <time dateTime={event.date}>{formatDate(event.date)}</time> · {event.time}
          </p>
          <h1 className="mt-2 text-4xl leading-tight text-text sm:text-5xl">{event.title}</h1>
          <p className="mt-2 font-body text-muted">{event.venue}</p>
          <p className="mt-5 font-body text-lg text-text">{event.description}</p>

          {/* Price and spots, laid out the same way as on the artwork page. */}
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-body">
            <dt className="text-muted">Price</dt>
            <dd className="text-text">{isFree ? 'Free' : `${formatPrice(event.price)} per spot`}</dd>
            <dt className="text-muted">Spots left</dt>
            <dd className="text-text">{event.spots}</dd>
          </dl>
        </div>

        <div className="min-w-0">
          {/* Show the form until it's sent, then show the thank-you message instead. */}
          {guest === null ? (
            <form onSubmit={handleSubmit} className="rounded-lg bg-surface p-5 sm:p-8">
              <h2 className="text-2xl text-text">
                Book Your <span className="text-muted">Spot.</span>
              </h2>

              <p className={labelClasses}>Number of spots:</p>
              <QuantityStepper value={spots} onChange={setSpots} min={1} max={maxSpots} label="Number of spots" />
              {/* Only show a total if the event isn't free ("!isFree" means "not free"). */}
              {!isFree && (
                <p className="mt-4 font-body text-text">
                  Total: <span className="font-semibold text-accent">{formatPrice(event.price * spots)}</span>
                </p>
              )}

              <label htmlFor="guest-name" className={labelClasses}>Name:</label>
              <input type="text" id="guest-name" name="name" placeholder="Enter your name" autoComplete="name" required className={inputClasses} />

              <label htmlFor="guest-email" className={labelClasses}>Email:</label>
              <input type="email" id="guest-email" name="email" placeholder="Enter your email" autoComplete="email" required className={inputClasses} />

              <label htmlFor="guest-phone" className={labelClasses}>Cellphone Number:</label>
              <input type="tel" id="guest-phone" name="phone" placeholder="Enter your phone number" autoComplete="tel" required className={inputClasses} />

              <button type="submit" className={submitClasses}>
                {/* "spot" or "spots", depending on the number. */}
                Book {spots} {spots === 1 ? 'spot' : 'spots'}
              </button>
            </form>
          ) : (
            <div role="status" className={thankYouClasses}>
              <p className="text-xl text-accent">You&rsquo;re booked, {guest.name}!</p>
              <p className="mt-2">
                {spots} {spots === 1 ? 'spot' : 'spots'} for {event.title} on {formatDate(event.date)}.
                We&rsquo;ll send the details to {guest.email}.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default EventPage // Lets App.jsx load this with: import EventPage from './pages/EventPage.jsx'
