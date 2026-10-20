import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from './formStyles.js' // Shared form styles.
import { apiFetch } from '../utils/api.js' // Sends the booking to the server.
import { authClient } from '../utils/authClient.js' // Who is signed in (to fill in their name and email).
import useSubmit from '../utils/useSubmit.js' // Sends the form and remembers how it went.

// The "Book Your Photoshoot" form at the bottom of the home page.
// The booking is saved in the database (POST /api/photoshoot-bookings).
function BookingForm() {
  const user = authClient.useSession().data?.user // The signed-in user, or undefined.

  // Runs when "Book Your Photoshoot" is clicked and every required box is filled in.
  // client = who sent it, once the server has saved it (null until then), which shows the thank-you message.
  const { handleSubmit, isSending, error, result: client } = useSubmit(async (form) => {
    await apiFetch('/api/photoshoot-bookings', {
      method: 'POST',
      body: { name: form.name, email: form.email, phone: form.number, style: form['photoshoot-style'] },
    })
    return form
  })

  return (
    // id="book" is what the menu's "Book" link (#book) jumps to.
    // w-[calc(100%-2rem)] = full width minus 1rem each side on phones; sm:w-full + max-w-[560px] = up to 560px wide.
    // bg-surface = slightly lighter dark grey box, rounded-lg = rounded corners, p-* = inner space (more on bigger screens).
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

      {/* Show the form until it's sent, then the thank-you message instead. */}
      {client === null ? (
        // key = start the form afresh when someone signs in, so their name and email (defaultValue) get filled in.
        <form key={user?.id ?? 'guest'} onSubmit={handleSubmit}>
          {/* htmlFor links each label to the box with the same id, so clicking the label selects the box.
              required = the browser won't send the form while this box is empty.
              autoComplete = lets the browser offer to fill in saved details. */}
          <label htmlFor="name" className={labelClasses}>Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" autoComplete="name" required defaultValue={user?.name} className={inputClasses} />

          <label htmlFor="email" className={labelClasses}>Email:</label>
          {/* type="email" = the browser checks it looks like an email address. */}
          <input type="email" id="email" name="email" placeholder="Enter your email" autoComplete="email" required defaultValue={user?.email} className={inputClasses} />

          <label htmlFor="number" className={labelClasses}>Cellphone Number:</label>
          {/* type="tel" = phones show a number keypad. */}
          <input type="tel" id="number" name="number" placeholder="Enter your phone number" autoComplete="tel" required className={inputClasses} />

          <label htmlFor="photoshoot-style" className={labelClasses}>Photoshoot Style:</label>
          {/* A drop-down. The first option has an empty value, so "required" makes the visitor pick a real style. */}
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
        // role="status" makes screen readers announce the message when it appears.
        <div role="status" className={thankYouClasses}>
          <p className="text-xl text-accent">Thank you, {client.name}!</p>
          <p className="mt-2">We&rsquo;ll be in touch at {client.email} to confirm your photoshoot.</p>
        </div>
      )}
    </section>
  )
}

export default BookingForm // Lets HomePage.jsx load this with: import BookingForm from '../components/BookingForm.jsx'
