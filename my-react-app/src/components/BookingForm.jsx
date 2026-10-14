import { useState } from 'react' // useState remembers whether the form has been sent.
import { inputClasses, labelClasses, submitClasses, thankYouClasses } from './formStyles.js' // Shared form styles.

// The "Book Your Photoshoot" form at the bottom of the home page.
// NOTE: it doesn't send anywhere yet; it only shows a thank-you message.
// To actually receive bookings, connect a form service (for example Formspree or Netlify Forms).
function BookingForm() {
  const [client, setClient] = useState(null) // Who sent the form. null = not sent yet.

  // Runs when "Book Your Photoshoot" is clicked and every required box is filled in.
  function handleSubmit(event) {
    event.preventDefault() // Stop the browser reloading the page.
    const formData = new FormData(event.target) // Collects everything typed into the form.
    setClient({ name: formData.get('name'), email: formData.get('email') }) // Remember who sent it, which shows the thank-you message.
  }

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
        <form onSubmit={handleSubmit}>
          {/* htmlFor links each label to the box with the same id, so clicking the label selects the box.
              required = the browser won't send the form while this box is empty.
              autoComplete = lets the browser offer to fill in saved details. */}
          <label htmlFor="name" className={labelClasses}>Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" autoComplete="name" required className={inputClasses} />

          <label htmlFor="email" className={labelClasses}>Email:</label>
          {/* type="email" = the browser checks it looks like an email address. */}
          <input type="email" id="email" name="email" placeholder="Enter your email" autoComplete="email" required className={inputClasses} />

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

          <button type="submit" className={submitClasses}>Book Your Photoshoot</button>
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
