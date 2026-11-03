import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from './formStyles.js'
import { apiFetch } from '../utils/api.js'
import { authClient } from '../utils/authClient.js'
import useSubmit from '../utils/useSubmit.js'

export default function BookingForm() {
  const user = authClient.useSession().data?.user

  const { handleSubmit, isSending, error, result: client } = useSubmit(async (form) => {
    await apiFetch('/api/photoshoot-bookings', {
      method: 'POST',
      body: { name: form.name, email: form.email, phone: form.number, style: form['photoshoot-style'] },
    })
    return form
  })

  return (
    <section
      id="book"
      className="mx-auto my-6 w-[calc(100%-2rem)] max-w-[560px] rounded-lg bg-surface p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] sm:my-8 sm:w-full sm:p-8 md:p-12"
    >
      <h2 className="mb-2 text-center text-2xl text-text sm:text-[2rem]">
        Book Your <span className="text-muted">Photoshoot.</span>
      </h2>
      <p className="mb-4 text-center font-body text-text">
        Your moment deserves to be remembered. Book your Aurora session so we can turn it into something timeless.
      </p>

      {client === null ? (
        // Re-keyed on sign-in so the uncontrolled inputs pick up the user's name and email as defaults.
        <form key={user?.id ?? 'guest'} onSubmit={handleSubmit}>
          <label htmlFor="name" className={labelClasses}>Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" autoComplete="name" required defaultValue={user?.name} className={inputClasses} />

          <label htmlFor="email" className={labelClasses}>Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" autoComplete="email" required defaultValue={user?.email} className={inputClasses} />

          <label htmlFor="number" className={labelClasses}>Cellphone Number:</label>
          <input type="tel" id="number" name="number" placeholder="Enter your phone number" autoComplete="tel" required className={inputClasses} />

          <label htmlFor="photoshoot-style" className={labelClasses}>Photoshoot Style:</label>
          <select
            id="photoshoot-style"
            name="photoshoot-style"
            required
            className="w-full cursor-pointer rounded-md border-2 border-background bg-text py-3.5 pr-10 pl-4 font-body text-base text-background focus:border-accent focus:outline-none sm:py-3"
          >
            <option value="">Select a style</option>
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
          </select>

          {error && <p role="alert" className={errorClasses}>{error.message}</p>}

          <button type="submit" disabled={isSending} className={submitClasses}>
            {isSending ? 'Sending…' : 'Book Your Photoshoot'}
          </button>
        </form>
      ) : (
        <div role="status" className={thankYouClasses}>
          <p className="text-xl text-accent">Thank you, {client.name}!</p>
          <p className="mt-2">We&rsquo;ll be in touch at {client.email} to confirm your photoshoot.</p>
        </div>
      )}
    </section>
  )
}
