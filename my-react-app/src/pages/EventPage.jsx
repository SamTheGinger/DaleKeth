import { useState } from 'react' // useState lets this page remember the number of spots.
import QuantityStepper from '../components/QuantityStepper.jsx' // The − 1 + control.
import { formatDate, formatPrice } from '../utils/format.js' // Nicely written dates and prices.
import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js' // Shared form styles.
import { apiFetch } from '../utils/api.js' // Sends the booking to the server.
import { authClient } from '../utils/authClient.js' // Who is signed in (to fill in their name and email).
import useSubmit from '../utils/useSubmit.js' // Sends the form and remembers how it went.

// The page that opens when "Book a spot" is clicked on an event.
// It shows the event details, lets the visitor choose how many spots they want,
// and has a form to book them.
//
// The booking is saved in the database (POST /api/events/:id/bookings), and the server takes the
// spots off the event in the same step, so two people can never book the same last spot.
//
// Props (input from App.jsx):
//   event  the event object for this page (loaded from GET /api/events/:id).
function EventPage({ event }) {
  const [spots, setSpots] = useState(1) // How many spots to book. Starts at 1.
  const user = authClient.useSession().data?.user // The signed-in user, or undefined.

  // Runs when the booking form is sent. guest = who booked plus the server's reply (null until it worked),
  // which shows the thank-you message.
  const { handleSubmit, isSending, error, result: guest } = useSubmit(async (form) => {
    const booking = await apiFetch(`/api/events/${event.id}/bookings`, {
      method: 'POST',
      body: { spots, name: form.name, email: form.email, phone: form.phone },
    })
    return { ...form, spotsLeft: booking.spotsLeft }
  })

  // After booking, show the new number of spots the server sent back.
  const spotsLeft = guest ? guest.spotsLeft : event.spots

  // At most 10 spots per booking, or fewer if there aren't 10 left.
  // Math.min() gives back the smaller of the numbers it's given.
  const maxSpots = Math.min(10, event.spots)
  const isFree = event.price === 0 // true for free events, so we can say "Free" instead of "R 0".

  return (
    <section className="mx-auto w-full max-w-275 px-4 py-8 sm:px-6 sm:py-12">
      <a href="#events" className="font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Events
      </a>

      {/* The event's image as a wide banner. aspect-[21/9] = very wide on phones; md:aspect-[3/1] = even wider from 900px. */}
      <img src={event.src} alt="" className="mt-6 aspect-21/9 w-full rounded-3xl border-2 border-accent object-cover md:aspect-3/1" />

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
            <dd className="text-text">{spotsLeft}</dd>
          </dl>
        </div>

        <div className="min-w-0">
          {/* Show the form until it's sent, then show the thank-you message instead. */}
          {event.spots === 0 ? (
            <p className={thankYouClasses}>This event is fully booked.</p>
          ) : guest === null ? (
            // key = start the form afresh when someone signs in, so their name and email (defaultValue) get filled in.
            <form key={user?.id ?? 'guest'} onSubmit={handleSubmit} className="rounded-lg bg-surface p-5 sm:p-8">
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
              <input type="text" id="guest-name" name="name" placeholder="Enter your name" autoComplete="name" required defaultValue={user?.name} className={inputClasses} />

              <label htmlFor="guest-email" className={labelClasses}>Email:</label>
              <input type="email" id="guest-email" name="email" placeholder="Enter your email" autoComplete="email" required defaultValue={user?.email} className={inputClasses} />

              <label htmlFor="guest-phone" className={labelClasses}>Cellphone Number:</label>
              <input type="tel" id="guest-phone" name="phone" placeholder="Enter your phone number" autoComplete="tel" required className={inputClasses} />

              {error && <p role="alert" className={errorClasses}>{error.message}</p>}

              <button type="submit" disabled={isSending} className={submitClasses}>
                {/* "spot" or "spots", depending on the number. */}
                {isSending ? 'Booking…' : `Book ${spots} ${spots === 1 ? 'spot' : 'spots'}`}
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
