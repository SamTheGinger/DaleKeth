import { useState } from 'react'
import QuantityStepper from '../components/QuantityStepper.jsx'
import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js'
import { apiFetch } from '../utils/api.js'
import { authClient } from '../utils/authClient.js'
import { formatDate, formatPrice, formatSpots } from '../utils/format.js'
import { rememberReturnTo } from '../utils/returnTo.js'
import useSubmit from '../utils/useSubmit.js'

const MAX_SPOTS = 10 // Mirrors MAX_SPOTS_PER_BOOKING on the server.

// Paid events: redirects to Stripe Checkout. The order page (#/order/:id) shows the result once
// Stripe's webhook confirms payment; spots are only deducted at that point.
function BuySpots({ event, spots }) {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  async function handleBuy() {
    setIsSending(true)
    setError(null)
    try {
      const { url } = await apiFetch('/api/checkout', { method: 'POST', body: { eventId: event.id, spots } })
      window.location.assign(url) // isSending stays true while the browser navigates away.
    } catch (buyError) {
      setError(buyError)
      setIsSending(false)
    }
  }

  if (isPending) return <p className="mt-8 animate-pulse text-center font-body text-muted">Loading&hellip;</p>

  if (!user) {
    const returnHere = () => rememberReturnTo(`#/event/${event.id}`)
    return (
      <>
        <a href="#/signin" onClick={returnHere} className={`${submitClasses} block text-center`}>
          Sign In to Buy
        </a>
        <p className="mt-3 text-center font-body text-sm text-muted">
          No account?{' '}
          <a href="#/signup" onClick={returnHere} className="text-accent underline hover:text-muted">
            Create one
          </a>{' '}
          so we can link your tickets to you.
        </p>
      </>
    )
  }

  return (
    <>
      {error && <p role="alert" className={errorClasses}>{error.message}</p>}
      <button type="button" onClick={handleBuy} disabled={isSending} className={submitClasses}>
        {isSending ? 'Going to checkout…' : `Buy ${formatSpots(spots)}`}
      </button>
      <p className="mt-3 text-center font-body text-sm text-muted">Secure payment with Stripe. Test mode: no real money is taken.</p>
    </>
  )
}

// Free events: reserved directly; the server deducts spots atomically.
function ReserveSpots({ event, spots, onReserved }) {
  const user = authClient.useSession().data?.user

  const { handleSubmit, isSending, error, result: guest } = useSubmit(async (form) => {
    const booking = await apiFetch(`/api/events/${event.id}/bookings`, {
      method: 'POST',
      body: { spots, name: form.name, email: form.email, phone: form.phone },
    })
    onReserved(booking.spotsLeft)
    return form
  })

  if (guest) {
    return (
      <div role="status" className={thankYouClasses}>
        <p className="text-xl text-accent">You&rsquo;re booked, {guest.name}!</p>
        <p className="mt-2">
          {formatSpots(spots)} for {event.title} on {formatDate(event.date)}. We&rsquo;ll send the details to {guest.email}.
        </p>
      </div>
    )
  }

  return (
    // Re-keyed on sign-in so the uncontrolled inputs pick up the user's name and email as defaults.
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

// Event detail page (#/event/:id).
export default function EventPage({ event }) {
  const [spots, setSpots] = useState(1)
  const [spotsLeft, setSpotsLeft] = useState(event.spots)
  const [isReserved, setIsReserved] = useState(false)

  const maxSpots = Math.min(MAX_SPOTS, event.spots)
  const isFree = event.price === 0

  function handleReserved(newSpotsLeft) {
    setSpotsLeft(newSpotsLeft)
    setIsReserved(true)
  }

  return (
    <section className="mx-auto w-full max-w-275 px-4 py-8 sm:px-6 sm:py-12">
      <a href="#events" className="font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Events
      </a>

      <img src={event.src} alt="" className="mt-6 aspect-21/9 w-full rounded-3xl border-2 border-accent object-cover md:aspect-3/1" />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
        <div className="min-w-0">
          <p className="font-body text-sm font-semibold tracking-wider text-accent uppercase">
            <time dateTime={event.date}>{formatDate(event.date)}</time> · {event.time}
          </p>
          <h1 className="mt-2 text-4xl leading-tight text-text sm:text-5xl">{event.title}</h1>
          <p className="mt-2 font-body text-muted">{event.venue}</p>
          <p className="mt-5 font-body text-lg text-text">{event.description}</p>

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
                  {/* Display only; the server computes the charged total from its own prices. */}
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
