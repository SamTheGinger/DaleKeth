// The Sign In (#/signin) and Create Account (#/signup) pages. They share one form;
// "mode" decides which one we're showing.
//
// Better Auth does the real work: it checks the password on the server, and on success the server
// sets an httpOnly session cookie. From then on every request to /api carries that cookie, which is
// how the server knows who you are. authClient.useSession() then updates the Header and every form.
//
// Props (input from App.jsx):
//   mode  'signin' or 'signup'.
import { authClient } from '../utils/authClient.js'
import useSubmit from '../utils/useSubmit.js'
import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js'

function AuthPage({ mode }) {
  const isSignUp = mode === 'signup'
  const { data: session, isPending } = authClient.useSession()

  const { handleSubmit, isSending, error } = useSubmit(async (form) => {
    // Better Auth gives back { data, error } instead of throwing, so we throw the error ourselves
    // to let useSubmit show it.
    const { error } = isSignUp
      ? await authClient.signUp.email({
          name: form.name,
          email: form.email,
          password: form.password,
          // A ticked checkbox sends 'on'; an unticked one sends nothing. === 'on' turns that into true/false.
          // The server saves it on the account and, if true, emails the photographer (server/src/auth.js).
          marketingOptIn: form.marketing === 'on',
        })
      : await authClient.signIn.email({ email: form.email, password: form.password })
    if (error) throw new Error(error.message || 'Something went wrong. Please try again.')
    window.location.hash = '#portfolio' // Signed in: back to the portfolio, where favourites can now be saved.
  })

  async function handleSignOut() {
    await authClient.signOut()
  }

  return (
    // Same box style as the photoshoot booking form, so it fits the rest of the site.
    <section className="mx-auto my-10 w-[calc(100%-2rem)] max-w-[480px] rounded-lg bg-surface p-5 sm:my-16 sm:w-full sm:p-8 md:p-10">
      <h1 className="mb-2 text-center text-3xl text-text sm:text-4xl">
        {isSignUp ? 'Create Your ' : 'Welcome '}
        <span className="text-muted">{isSignUp ? 'Account.' : 'Back.'}</span>
      </h1>

      {isPending ? null : session ? (
        // Already signed in (for example, someone opened #/signin from a bookmark).
        <div role="status" className={thankYouClasses}>
          <p>You&rsquo;re signed in as {session.user.email}.</p>
          <button type="button" onClick={handleSignOut} className={submitClasses}>Sign Out</button>
        </div>
      ) : (
        <>
          <p className="mb-2 text-center font-body text-text">
            {isSignUp
              ? 'Save your favourite photos and see your details filled in when you book.'
              : 'Sign in to see your saved favourites.'}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Only the sign-up form asks for a name. */}
            {isSignUp && (
              <>
                <label htmlFor="auth-name" className={labelClasses}>Name:</label>
                <input type="text" id="auth-name" name="name" placeholder="Enter your name" autoComplete="name" required className={inputClasses} />
              </>
            )}

            <label htmlFor="auth-email" className={labelClasses}>Email:</label>
            <input type="email" id="auth-email" name="email" placeholder="Enter your email" autoComplete="email" required className={inputClasses} />

            <label htmlFor="auth-password" className={labelClasses}>Password:</label>
            {/* autoComplete tells password managers whether to suggest a new password or fill in a saved one.
                minLength matches the server's rule (8 characters), so the browser can warn before sending. */}
            <input
              type="password"
              id="auth-password"
              name="password"
              placeholder={isSignUp ? 'At least 8 characters' : 'Enter your password'}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={isSignUp ? 8 : undefined}
              required
              className={inputClasses}
            />

            {/* Only on sign-up: the email marketing box. It starts UNTICKED, so people choose for themselves
                (opt-in), which is what South Africa's POPIA law expects for marketing emails.
                The whole row is the <label>, so tapping the text ticks the box too.
                accent-accent = a gold tick box; size-5 = 20px, easy to tap; mt-0.5 lines it up with the first line of text. */}
            {isSignUp && (
              <label className="mt-6 flex cursor-pointer items-start gap-3 font-body text-text">
                <input type="checkbox" name="marketing" className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent" />
                <span>
                  Send me news, new work and event updates by email.
                  <span className="block text-sm text-muted">Optional. You can unsubscribe at any time.</span>
                </span>
              </label>
            )}

            {error && <p role="alert" className={errorClasses}>{error.message}</p>}

            <button type="submit" disabled={isSending} className={submitClasses}>
              {isSending ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* A link to the other page. */}
          <p className="mt-6 text-center font-body text-text">
            {isSignUp ? 'Already have an account? ' : 'New here? '}
            <a href={isSignUp ? '#/signin' : '#/signup'} className="font-semibold text-accent underline hover:text-muted">
              {isSignUp ? 'Sign in' : 'Create an account'}
            </a>
          </p>
        </>
      )}
    </section>
  )
}

export default AuthPage // Lets App.jsx load this with: import AuthPage from './pages/AuthPage.jsx'
