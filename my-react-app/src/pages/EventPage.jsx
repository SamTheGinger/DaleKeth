import { useState } from 'react' // useState lets this page remember the number of spots.
import QuantityStepper from '../components/QuantityStepper.jsx' // The − 1 + control.
import { formatDate, formatPrice } from '../utils/format.js' // Nicely written dates and prices.
import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js' // Shared form styles.
import { apiFetch } from '../utils/api.js' // Talks to the server.
import { authClient } from '../utils/authClient.js' // Who is signed in.
import useSubmit from '../utils/useSubmit.js' // Sends the form and remembers how it went.

const MAX_SPOTS = 10 // At most 10 spots at a time (the server has the same limit).

// Remembers to come back to this event after signing in (AuthPage.jsx reads it). Wrapped in try/catch because
// some browsers (e.g. private mode) refuse to store anything; then they just land on the default page.
function returnHereAfterSignIn(eventId) {
  try {
    sessionStorage.setItem('returnTo', `#/event/${eventId}`)
  } catch {
    // Not important enough to stop them signing in.
  }
}

// Paid events: buy spots with Stripe Checkout (test mode). Only signed-in accounts can buy.
//   1. POST /api/checkout { eventId, spots } makes a 'pending' order and gives back Stripe's checkout address.
//   2. The browser goes to that address, Stripe's own payment page.
//   3. After paying, Stripe sends the buyer to #/order/<id> (OrderPage.jsx), which shows the order's status.
// The spots only come off the event once Stripe's webhook confirms the payment (server/src/routes/stripeWebhook.js).
function BuySpots({ event, spots }) {
  const [isSending, setIsSending] = useState(false) // True while waiting for the server, so Buy can't be clicked twice.
  const [error, setError] = useState(null)
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  async function handleBuy() {
    setIsSending(true)
    setError(null)
    try {
      // Only WHICH event and HOW MANY spots are sent. The server looks up the price itself.
      const { url } = await apiFetch('/api/checkout', { method: 'POST', body: { eventId: event.id, spots } })
      window.location.assign(url) // Leave our site for Stripe's checkout page. isSending stays true while it loads.
    } catch (buyError) {
      setError(buyError)
      setIsSending(false)
    }
  }

  if (isPending) return <p className="mt-8 animate-pulse text-center font-body text-muted">Loading&hellip;</p>

  if (!user) {
    return (
      <>
        <a href="#/signin" onClick={() => returnHereAfterSignIn(event.id)} className={`${submitClasses} block text-center`}>
          Sign In to Buy
        </a>
        <p className="mt-3 text-center font-body text-sm text-muted">
          No account?{' '}
          <a href="#/signup" onClick={() => returnHereAfterSignIn(event.id)} className="text-accent underline hover:text-muted">
            Create one
          </a>{' '}
          so we can link your tickets to you.
        </p>
      </>
    )
  }

  return (
    <>
      {/* role="alert" makes screen readers read the problem out straight away. */}
      {error && <p role="alert" className={errorClasses}>{error.message}</p>}
      <button type="button" onClick={handleBuy} disabled={isSending} className={submitClasses}>
        {/* "spot" or "spots", depending on the number. */}
        {isSending ? 'Going to checkout…' : `Buy ${spots} ${spots === 1 ? 'spot' : 'spots'}`}
      </button>
      <p className="mt-3 text-center font-body text-sm text-muted">Secure payment with Stripe. Test mode: no real money is taken.</p>
    </>
  )
}

// Free events: nothing to pay, so spots are reserved with a short form (POST /api/events/:id/bookings).
// The server takes the spots off straight away, so two people can never reserve the same last spot.
function ReserveSpots({ event, spots, onReserved }) {
  const user = authClient.useSession().data?.user // The signed-in user, or undefined (to fill in name and email).

  // guest = who reserved, once the server has saved it (null until then), which shows the thank-you message.
  const { handleSubmit, isSending, error, result: guest } = useSubmit(async (form) => {
    const booking = await apiFetch(`/api/events/${event.id}/bookings`, {
      method: 'POST',
      body: { spots, name: form.name, email: form.email, phone: form.phone },
    })
    onReserved(booking.spotsLeft) // Show the new number of spots left.
    return form
  })

  if (guest) {
    return (
      <div role="status" className={thankYouClasses}>
        <p className="text-xl text-accent">You&rsquo;re booked, {guest.name}!</p>
        <p className="mt-2">
          {spots} {spots === 1 ? 'spot' : 'spots'} for {event.title} on {formatDate(event.date)}. We&rsquo;ll send the details to {guest.email}.
        </p>
      </div>
    )
  }

  return (
    // key = start the form afresh when someone signs in, so their name and email (defaultValue) get filled in.
    <form key={user?.id ?? 'guest'} onSubmit={handleSubmit}>
      <label htmlFor="guest-name" className={labelClasses}>Name:</label>
      <input type="text" id="guest-name" name="name" placeholder="Enter your name" autoComplete="name" required defaultValue={user?.name} className={inputClasses} />

      <label htmlFor="guest-email" className={labelClasses}>Email:</label>
      <input type="email" id="guest-email" name="email" placeholder="Enter your email" autoComplete="email" required defaultValue={user?.email} className={inputClasses} />

      <label htmlFor="guest-phone" className={labelClasses}>Cellphone Number:</label>
      <input type="tel" id="guest-phone" name="phone" placeholder="Enter your phone number" autoComplete="tel" required className={inputClasses} />

      {error && <p role="alert" className={errorClasses}>{error.message}</p>}

      <button type="submit" disabled={isSending} className={submitClasses}>
        {isSending ? 'Reserving…' : `Reserve ${spots} free ${spots === 1 ? 'spot' : 'spots'}`}
      </button>
    </form>
  )
}

// The page that opens when an event's button is clicked (#/event/1).
// It shows the event details and lets the visitor choose how many spots they want. Paid events are bought
// with Stripe (BuySpots); free events are reserved with a short form (ReserveSpots).
//
// Props (input from App.jsx):
//   event  the event object for this page (loaded from GET /api/events/:id).
function EventPage({ event }) {
  const [spots, setSpots] = useState(1) // How many spots. Starts at 1.
  const [spotsLeft, setSpotsLeft] = useState(event.spots) // Goes down straight away after a free reservation.
  const [isReserved, setIsReserved] = useState(false) // Hides the stepper once a free reservation is made.

  // At most 10 spots, or fewer if there aren't 10 left. Math.min() gives back the smaller number.
  const maxSpots = Math.min(MAX_SPOTS, event.spots)
  const isFree = event.price === 0 // true for free events, so we can say "Free" instead of "R 0".

  function handleReserved(newSpotsLeft) {
    setSpotsLeft(newSpotsLeft)
    setIsReserved(true)
  }

  return (
    <section className="mx-auto w-full max-w-275 px-4 py-8 sm:px-6 sm:py-12">
      <a href="#events" className="font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Events
      </a>

      {/* The event's image as a wide banner. aspect-[21/9] = very wide on phones; md:aspect-[3/1] = even wider from 900px. */}
      <img src={event.src} alt="" className="mt-6 aspect-21/9 w-full rounded-3xl border-2 border-accent object-cover md:aspect-3/1" />

      {/* Mobile-first: details and the buy box are stacked on phones; from 900px (md:) the details sit on
          the left (wider: 3fr) and the buy box on the right (narrower: 2fr). */}
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
          {event.spots === 0 ? (
            <p className={thankYouClasses}>This event is fully booked.</p>
          ) : (
            <div className="rounded-lg bg-surface p-5 sm:p-8">
              <h2 className="text-2xl text-text">
                {isFree ? 'Reserve Your ' : 'Buy Your '}
                <span className="text-muted">{isFree ? 'Spot.' : 'Spots.'}</span>
              </h2>

              {!isReserved && (
                <>
                  <p className={labelClasses}>Number of spots:</p>
                  <QuantityStepper value={spots} onChange={setSpots} min={1} max={maxSpots} label="Number of spots" />
                  {/* Only show a total if the event isn't free. Only for show: the server works out the real one. */}
                  {!isFree && (
                    <p className="mt-4 font-body text-text">
                      Total: <span className="font-semibold text-accent">{formatPrice(event.price * spots)}</span>
                    </p>
                  )}
                </>
              )}

              {isFree ? (
                <ReserveSpots event={event} spots={spots} onReserved={handleReserved} />
              ) : (
                <BuySpots event={event} spots={spots} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default EventPage // Lets App.jsx load this with: import EventPage from './pages/EventPage.jsx'
