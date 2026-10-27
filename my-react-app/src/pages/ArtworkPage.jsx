import { useState } from 'react' // useState lets this page remember the quantity.
import QuantityStepper from '../components/QuantityStepper.jsx' // The − 1 + control.
import { formatPrice } from '../utils/format.js' // Turns 2400 into "R 2 400".
import { errorClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js' // Shared form styles.
import { apiFetch } from '../utils/api.js' // Talks to the server.
import { authClient } from '../utils/authClient.js' // Who is signed in: only accounts can buy.

// Remembers to come back to this artwork after signing in (AuthPage.jsx reads it). Wrapped in try/catch because
// some browsers (e.g. private mode) refuse to store anything; then they just land on the default page.
function returnHereAfterSignIn(artworkId) {
  try {
    sessionStorage.setItem('returnTo', `#/artwork/${artworkId}`)
  } catch {
    // Not important enough to stop them signing in.
  }
}

// The page that opens when an artwork card in the Shop is clicked.
// It shows the artwork, its details and price, lets the buyer pick how many, and has a Buy Now button.
//
// Buy Now pays with Stripe Checkout (test mode):
//   1. POST /api/checkout { artworkId, quantity } makes a 'pending' order and gives back Stripe's checkout address.
//   2. The browser goes to that address, Stripe's own payment page.
//   3. After paying, Stripe sends the buyer to #/order/<id> (OrderPage.jsx), which shows the order's status.
// Only signed-in accounts can buy, so everyone else is asked to sign in first.
//
// Props (input from App.jsx):
//   artwork  the artwork object for this page (loaded from GET /api/artworks/:id).
function ArtworkPage({ artwork }) {
  const [quantity, setQuantity] = useState(1) // How many the buyer wants. Starts at 1.
  const [isSending, setIsSending] = useState(false) // True while waiting for the server, so Buy Now can't be clicked twice.
  const [error, setError] = useState(null)
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user // The signed-in user, or undefined.
  const isSoldOut = artwork.available === 0

  async function handleBuy() {
    setIsSending(true)
    setError(null)
    try {
      // Only WHICH artwork and HOW MANY are sent. The server looks up the price itself.
      const { url } = await apiFetch('/api/checkout', { method: 'POST', body: { artworkId: artwork.id, quantity } })
      window.location.assign(url) // Leave our site for Stripe's checkout page. isSending stays true while it loads.
    } catch (buyError) {
      setError(buyError)
      setIsSending(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-275 px-4 py-8 sm:px-6 sm:py-12">
      <a href="#shop" className="font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Shop
      </a>

      {/* Mobile-first layout: image on top, details underneath on phones.
          From 900px (md:) they sit side by side: md:grid-cols-2 = two equal columns. */}
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <img
          src={artwork.src}
          alt={artwork.title}
          // w-full = fills its column, rounded-3xl = rounded corners, md:sticky md:top-28 = on wide screens
          // the image stays in view while you scroll down the details beside it.
          className="aspect-4/5 w-full min-w-0 rounded-3xl border-2 border-accent object-cover md:sticky md:top-28"
        />

        <div className="min-w-0">
          <h1 className="text-4xl leading-tight text-text sm:text-5xl">{artwork.title}</h1>
          <p className="mt-3 font-body text-2xl font-semibold text-accent">{formatPrice(artwork.price)}</p>
          <p className="mt-4 font-body text-text">{artwork.description}</p>

          {/* A "description list" (<dl>): pairs of a term (<dt>) and its value (<dd>).
              grid-cols-[auto_1fr] = 2 columns: the first is as wide as the longest label, the second takes the rest. */}
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-body">
            <dt className="text-muted">Medium</dt>
            <dd className="text-text">{artwork.medium}</dd>
            <dt className="text-muted">Size</dt>
            <dd className="text-text">{artwork.size}</dd>
            <dt className="text-muted">Available</dt>
            <dd className="text-text">{artwork.available} left</dd>
          </dl>

          {isSoldOut ? (
            <p className={thankYouClasses}>This piece has sold out.</p>
          ) : (
            <div className="mt-8 rounded-lg bg-surface p-5 sm:p-8">
              {/* A label for the stepper. It's a <p> rather than <label> because the stepper is buttons, not a text box. */}
              <p className={labelClasses}>Quantity:</p>
              <QuantityStepper
                value={quantity} // The number to show.
                onChange={setQuantity} // When − or + is clicked, store the new number.
                min={1}
                max={artwork.available} // Can't order more than are left.
                label="Number of pieces"
              />
              {/* The total: price × quantity. The * symbol means "multiply". Only for show: the server works out the real one. */}
              <p className="mt-4 font-body text-text">
                Total: <span className="font-semibold text-accent">{formatPrice(artwork.price * quantity)}</span>
              </p>

              {/* role="alert" makes screen readers read the problem out straight away. */}
              {error && <p role="alert" className={errorClasses}>{error.message}</p>}

              {isPending ? (
                <p className="mt-8 animate-pulse text-center font-body text-muted">Loading&hellip;</p>
              ) : user ? (
                <>
                  <button type="button" onClick={handleBuy} disabled={isSending} className={submitClasses}>
                    {isSending ? 'Going to checkout…' : 'Buy Now'}
                  </button>
                  <p className="mt-3 text-center font-body text-sm text-muted">Secure payment with Stripe. Test mode: no real money is taken.</p>
                </>
              ) : (
                <>
                  <a href="#/signin" onClick={() => returnHereAfterSignIn(artwork.id)} className={`${submitClasses} block text-center`}>
                    Sign In to Buy
                  </a>
                  <p className="mt-3 text-center font-body text-sm text-muted">
                    No account?{' '}
                    <a href="#/signup" onClick={() => returnHereAfterSignIn(artwork.id)} className="text-accent underline hover:text-muted">
                      Create one
                    </a>{' '}
                    so we can link the order to you.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ArtworkPage // Lets App.jsx load this with: import ArtworkPage from './pages/ArtworkPage.jsx'
