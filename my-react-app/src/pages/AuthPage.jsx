import { errorClasses, inputClasses, labelClasses, submitClasses, thankYouClasses } from '../components/formStyles.js'
import { authClient } from '../utils/authClient.js'
import { takeReturnTo } from '../utils/returnTo.js'
import useSubmit from '../utils/useSubmit.js'

// Sign-in (#/signin) and sign-up (#/signup), sharing one form.
export default function AuthPage({ mode }) {
  const isSignUp = mode === 'signup'
  const { data: session, isPending } = authClient.useSession()

  const { handleSubmit, isSending, error } = useSubmit(async (form) => {
    // Better Auth returns { error } instead of throwing; rethrow so useSubmit can display it.
    const { error } = isSignUp
      ? await authClient.signUp.email({
          name: form.name,
          email: form.email,
          password: form.password,
          marketingOptIn: form.marketing === 'on',
        })
      : await authClient.signIn.email({ email: form.email, password: form.password })
    if (error) throw new Error(error.message || 'Something went wrong. Please try again.')
    window.location.hash = takeReturnTo() ?? '#portfolio'
  })

  return (
    <section className="mx-auto my-10 w-[calc(100%-2rem)] max-w-[480px] rounded-lg bg-surface p-5 sm:my-16 sm:w-full sm:p-8 md:p-10">
      <h1 className="mb-2 text-center text-3xl text-text sm:text-4xl">
        {isSignUp ? 'Create Your ' : 'Welcome '}
        <span className="text-muted">{isSignUp ? 'Account.' : 'Back.'}</span>
      </h1>

      {isPending ? null : session ? (
        <div role="status" className={thankYouClasses}>
          <p>You&rsquo;re signed in as {session.user.email}.</p>
          <button type="button" onClick={() => authClient.signOut()} className={submitClasses}>Sign Out</button>
        </div>
      ) : (
        <>
          <p className="mb-2 text-center font-body text-text">
            {isSignUp
              ? 'Save your favourite photos and see your details filled in when you book.'
              : 'Sign in to see your saved favourites.'}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <label htmlFor="auth-name" className={labelClasses}>Name:</label>
                <input type="text" id="auth-name" name="name" placeholder="Enter your name" autoComplete="name" required className={inputClasses} />
              </>
            )}

            <label htmlFor="auth-email" className={labelClasses}>Email:</label>
            <input type="email" id="auth-email" name="email" placeholder="Enter your email" autoComplete="email" required className={inputClasses} />

            <label htmlFor="auth-password" className={labelClasses}>Password:</label>
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

            {/* Unchecked by default: marketing consent must be an explicit opt-in under POPIA. */}
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
