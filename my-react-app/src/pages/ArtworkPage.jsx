import { useState } from 'react' // useState lets this page remember the quantity.
import QuantityStepper from '../components/QuantityStepper.jsx' // The − 1 + control.
import { formatPrice } from '../utils/format.js' // Turns 2400 into "R 2 400".
import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js' // Shared form styles.
import { apiFetch } from '../utils/api.js' // Sends the request to the server.
import { authClient } from '../utils/authClient.js' // Who is signed in (to fill in their name and email).
import useSubmit from '../utils/useSubmit.js' // Sends the form and remembers how it went.

// The page that opens when an artwork card in the Shop is clicked.
// It shows the artwork, its details and price, lets the buyer pick how many,
// and has a short form to request the purchase.
//
// The request is saved in the database (POST /api/artworks/:id/purchase-requests), linked to
// the buyer's account if they're signed in. NOTE: this doesn't take payment.
// To take real payments you'd connect a payment service (for example PayFast, Yoco or Stripe).
//
// Props (input from App.jsx):
//   artwork  the artwork object for this page (loaded from GET /api/artworks/:id).
function ArtworkPage({ artwork }) {
  const [quantity, setQuantity] = useState(1) // How many the buyer wants. Starts at 1.
  const user = authClient.useSession().data?.user // The signed-in user, or undefined.
  const isSoldOut = artwork.available === 0

  // Runs when the form is sent (and every "required" box is filled in).
  // buyer = the name and email once the server has saved the request (null until then), which shows the thank-you message.
  const { handleSubmit, isSending, error, result: buyer } = useSubmit(async (form) => {
    await apiFetch(`/api/artworks/${artwork.id}/purchase-requests`, {
      method: 'POST',
      body: { quantity, name: form.name, email: form.email },
    })
    return form
  })

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

          {/* If buyer is still null (form not sent), show the form. Otherwise show the thank-you message. */}
          {isSoldOut ? (
            <p className={thankYouClasses}>This piece has sold out.</p>
          ) : buyer === null ? (
            // key = start the form afresh when someone signs in, so their name and email (defaultValue) get filled in.
            <form key={user?.id ?? 'guest'} onSubmit={handleSubmit} className="mt-8 rounded-lg bg-surface p-5 sm:p-8">
              {/* A label for the stepper. It's a <p> rather than <label> because the stepper is buttons, not a text box. */}
              <p className={labelClasses}>Quantity:</p>
              <QuantityStepper
                value={quantity} // The number to show.
                onChange={setQuantity} // When − or + is clicked, store the new number.
                min={1}
                max={artwork.available} // Can't order more than are left.
                label="Number of pieces"
              />
              {/* The total: price × quantity. The * symbol means "multiply". */}
              <p className="mt-4 font-body text-text">
                Total: <span className="font-semibold text-accent">{formatPrice(artwork.price * quantity)}</span>
              </p>

              {/* htmlFor (JSX's name for "for") links the label to the box with the same id, so clicking the label selects the box. */}
              <label htmlFor="buyer-name" className={labelClasses}>Name:</label>
              <input type="text" id="buyer-name" name="name" placeholder="Enter your name" autoComplete="name" required defaultValue={user?.name} className={inputClasses} />

              <label htmlFor="buyer-email" className={labelClasses}>Email:</label>
              <input type="email" id="buyer-email" name="email" placeholder="Enter your email" autoComplete="email" required defaultValue={user?.email} className={inputClasses} />

              {/* role="alert" makes screen readers read the problem out straight away. */}
              {error && <p role="alert" className={errorClasses}>{error.message}</p>}

              <button type="submit" disabled={isSending} className={submitClasses}>
                {isSending ? 'Sending…' : 'Request to Buy'}
              </button>
            </form>
          ) : (
            // role="status" makes screen readers announce this message as soon as it appears.
            <div role="status" className={thankYouClasses}>
              <p className="text-xl text-accent">Thank you, {buyer.name}!</p>
              <p className="mt-2">
                {/* e.g. "We've received your request for 2 × Copper Study (R 3 900)." */}
                We&rsquo;ve received your request for {quantity} &times; {artwork.title} ({formatPrice(artwork.price * quantity)}).
                We&rsquo;ll email {buyer.email} to arrange payment and delivery.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ArtworkPage // Lets App.jsx load this with: import ArtworkPage from './pages/ArtworkPage.jsx'
