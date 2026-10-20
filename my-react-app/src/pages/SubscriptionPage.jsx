// The "Your Subscription" page (#/subscription). Opened from "Subscribed ✓" in the header's View menu,
// and from the "Subscribe again" button in the email people get after unsubscribing.
//   Signed out        -> asks them to sign in (then brings them back here).
//   Subscribed        -> what they get, why it's worth it, and an Unsubscribe button (with an "are you sure?").
//   Not subscribed    -> the same, with a Subscribe button instead.
import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api.js'
import { authClient, refreshSession } from '../utils/authClient.js'
import { errorClasses, submitClasses } from '../components/formStyles.js'

// What subscribers get. Edit these lists to change what the page says.
const whatYouGet = [
  'New work and series, as soon as they’re released',
  'New original charcoal pieces and prints in the shop',
  'Invitations to live installations, exhibitions and workshops',
]
const benefits = [
  { title: 'Be first to know', text: 'Most originals are one of a kind. Subscribers hear about new pieces before anyone else.' },
  { title: 'Book before spots run out', text: 'Events have limited spots. You’ll get the dates early enough to book.' },
  { title: 'No spam', text: 'Emails only go out when there’s something worth sharing, and every one has an unsubscribe link.' },
]

// Remembers to come back to this page after signing in (AuthPage.jsx reads it). Wrapped in try/catch because
// some browsers (e.g. private mode) refuse to store anything; then they just land on the default page.
function returnHereAfterSignIn() {
  try {
    sessionStorage.setItem('returnTo', '#/subscription')
  } catch {
    // Not important enough to stop them signing in.
  }
}

function SubscriptionPage() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const userId = user?.id

  // What the server said, and for which user (if the user changes, the old answer no longer counts).
  const [status, setStatus] = useState({ userId: null, subscribed: false })
  const [isConfirming, setIsConfirming] = useState(false) // Showing "Are you sure?" before unsubscribing.
  const [justUnsubscribed, setJustUnsubscribed] = useState(false) // Show "we've emailed you a confirmation".
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  // When someone is signed in, ask the server whether they're subscribed.
  useEffect(() => {
    if (!userId) return
    let isCurrent = true
    apiFetch('/api/subscription').then(
      (data) => {
        if (!isCurrent) return
        setStatus({ userId, subscribed: data.subscribed })
        if (data.changed) refreshSession() // The server just updated their account: let the header catch up.
      },
      (loadError) => isCurrent && setError(loadError),
    )
    return () => {
      isCurrent = false
    }
  }, [userId])

  // Subscribe (method 'POST') or unsubscribe (method 'DELETE').
  async function change(method) {
    setIsSending(true)
    setError(null)
    try {
      const data = await apiFetch('/api/subscription', { method })
      setStatus({ userId, subscribed: data.subscribed })
      setJustUnsubscribed(!data.subscribed)
      setIsConfirming(false)
      refreshSession() // So the header's View menu switches between "Subscribe" and "Subscribed ✓".
    } catch (changeError) {
      setError(changeError)
    } finally {
      setIsSending(false)
    }
  }

  const isChecking = Boolean(userId) && status.userId !== userId && !error
  const pillClasses = 'inline-block cursor-pointer rounded-full px-6 py-2.5 font-body font-semibold transition-colors disabled:cursor-wait disabled:opacity-60'

  let content
  if (isPending || isChecking) {
    content = <p className="animate-pulse text-center font-body text-muted">Loading&hellip;</p>
  } else if (!user) {
    content = (
      <div className="text-center">
        <p className="font-body text-text">Sign in to see and manage your email subscription.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a href="#/signin" onClick={returnHereAfterSignIn} className={`${pillClasses} bg-accent text-background hover:bg-muted`}>Sign In</a>
          <a href="#/signup" onClick={returnHereAfterSignIn} className="font-body font-semibold text-accent underline hover:text-muted">Create an account</a>
        </div>
      </div>
    )
  } else {
    content = (
      <>
        {/* Where they stand right now. role="status" announces it when it changes (after (un)subscribing). */}
        <div role="status" className="rounded-lg border-2 border-accent/40 p-4 text-center font-body text-text">
          {status.subscribed ? (
            <p>
              <span className="text-accent">&#10003; You&rsquo;re subscribed</span> as {user.email}.
            </p>
          ) : justUnsubscribed ? (
            <p>
              You&rsquo;ve unsubscribed. We&rsquo;ve emailed a confirmation to {user.email}.
              <span className="mt-1 block text-sm text-muted">Changed your mind? You can subscribe again below.</span>
            </p>
          ) : (
            <p>You&rsquo;re not subscribed at the moment.</p>
          )}
        </div>

        <h2 className="mt-8 text-2xl text-text">
          What You <span className="text-muted">Get.</span>
        </h2>
        <ul className="mt-3 space-y-2 font-body text-text">
          {whatYouGet.map((item) => (
            // flex + gap-3 = the gold tick and the text side by side; the tick is decoration, so screen readers skip it.
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="text-accent">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-2xl text-text">
          Why <span className="text-muted">Subscribe.</span>
        </h2>
        {/* One column on phones, three side by side from 640px (sm:). */}
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-lg bg-background p-4">
              <h3 className="font-body font-semibold text-accent">{benefit.title}</h3>
              <p className="mt-1 font-body text-sm text-text">{benefit.text}</p>
            </div>
          ))}
        </div>

        {error && <p role="alert" className={errorClasses}>{error.message}</p>}

        {/* The action at the bottom. */}
        <div className="mt-8 text-center">
          {!status.subscribed ? (
            <button type="button" onClick={() => change('POST')} disabled={isSending} className={submitClasses}>
              {isSending ? 'Subscribing…' : justUnsubscribed ? 'Subscribe Again' : 'Subscribe'}
            </button>
          ) : isConfirming ? (
            // Asks once before unsubscribing, so nobody does it by accident.
            <div className="rounded-lg border-2 border-muted/40 p-4">
              <p className="font-body text-text">Are you sure? You&rsquo;ll stop getting news, new work and event updates.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={() => change('DELETE')} disabled={isSending} className={`${pillClasses} border-2 border-accent text-accent hover:bg-accent/15`}>
                  {isSending ? 'Unsubscribing…' : 'Yes, unsubscribe'}
                </button>
                <button type="button" onClick={() => setIsConfirming(false)} className={`${pillClasses} bg-accent text-background hover:bg-muted`}>
                  Keep my subscription
                </button>
              </div>
            </div>
          ) : (
            // Deliberately quieter than the Subscribe button: a plain underlined link-style button.
            <button type="button" onClick={() => setIsConfirming(true)} className="cursor-pointer font-body text-muted underline hover:text-accent">
              Unsubscribe
            </button>
          )}
        </div>
      </>
    )
  }

  return (
    <section className="mx-auto my-10 w-[calc(100%-2rem)] max-w-[680px] rounded-lg bg-surface p-5 sm:my-16 sm:w-full sm:p-8 md:p-10">
      <h1 className="mb-6 text-center text-3xl text-text sm:text-4xl">
        Your <span className="text-muted">Subscription.</span>
      </h1>
      {content}
    </section>
  )
}

export default SubscriptionPage // Lets App.jsx load this with: import SubscriptionPage from './pages/SubscriptionPage.jsx'
