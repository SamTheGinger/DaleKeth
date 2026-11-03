import { useState } from 'react'
import QuantityStepper from '../components/QuantityStepper.jsx'
import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js'
import { apiFetch } from '../utils/api.js'
import { authClient } from '../utils/authClient.js'
import { formatPrice } from '../utils/format.js'
import useSubmit from '../utils/useSubmit.js'

// Artwork detail page (#/artwork/:id). Purchases are submitted as requests (no online payment);
// the photographer follows up by email to arrange payment and delivery.
export default function ArtworkPage({ artwork }) {
  const [quantity, setQuantity] = useState(1)
  const user = authClient.useSession().data?.user
  const isSoldOut = artwork.available === 0

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

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <img
          src={artwork.src}
          alt={artwork.title}
          className="aspect-4/5 w-full min-w-0 rounded-3xl border-2 border-accent object-cover md:sticky md:top-28"
        />

        <div className="min-w-0">
          <h1 className="text-4xl leading-tight text-text sm:text-5xl">{artwork.title}</h1>
          <p className="mt-3 font-body text-2xl font-semibold text-accent">{formatPrice(artwork.price)}</p>
          <p className="mt-4 font-body text-text">{artwork.description}</p>

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
          ) : buyer === null ? (
            // Re-keyed on sign-in so the uncontrolled inputs pick up the user's name and email as defaults.
            <form key={user?.id ?? 'guest'} onSubmit={handleSubmit} className="mt-8 rounded-lg bg-surface p-5 sm:p-8">
              <p className={labelClasses}>Quantity:</p>
              <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={artwork.available} label="Number of pieces" />
              <p className="mt-4 font-body text-text">
                Total: <span className="font-semibold text-accent">{formatPrice(artwork.price * quantity)}</span>
              </p>

              <label htmlFor="buyer-name" className={labelClasses}>Name:</label>
              <input type="text" id="buyer-name" name="name" placeholder="Enter your name" autoComplete="name" required defaultValue={user?.name} className={inputClasses} />

              <label htmlFor="buyer-email" className={labelClasses}>Email:</label>
              <input type="email" id="buyer-email" name="email" placeholder="Enter your email" autoComplete="email" required defaultValue={user?.email} className={inputClasses} />

              {error && <p role="alert" className={errorClasses}>{error.message}</p>}

              <button type="submit" disabled={isSending} className={submitClasses}>
                {isSending ? 'Sending…' : 'Request to Buy'}
              </button>
            </form>
          ) : (
            <div role="status" className={thankYouClasses}>
              <p className="text-xl text-accent">Thank you, {buyer.name}!</p>
              <p className="mt-2">
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
