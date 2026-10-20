import { useEffect, useState } from 'react' // useState remembers the answer; useEffect asks the server after drawing.
import { apiFetch } from '../utils/api.js' // Talks to the server.
import { authClient, refreshSession } from '../utils/authClient.js' // Who (if anyone) is signed in, and refreshing that.
import { errorClasses } from './formStyles.js' // The red-bordered error box shared by every form.

// The small "Stay in the loop" section at the very bottom of the home page (below Book).
//   Not signed in        -> asks them to create an account (the sign-up form has the same tick box).
//   Signed in            -> a Subscribe button (GET / POST /api/subscription).
//   Already subscribed   -> a short "you're subscribed" note instead.
function SubscribeSection() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const userId = user?.id // Just the id, so the check below re-runs only when a different person signs in.

  // What the server said, and for which user. If the user changes (sign in / out), the old answer no longer counts.
  const [status, setStatus] = useState({ userId: null, subscribed: false })
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  // When someone is signed in, ask the server whether they're subscribed.
  useEffect(() => {
    if (!userId) return
    let isCurrent = true // Ignore the answer if they signed out before it arrived.
    apiFetch('/api/subscription').then(
      (data) => {
        if (!isCurrent) return
        setStatus({ userId, subscribed: data.subscribed })
        // If they unsubscribed through an email link, the server has just updated their account (changed),
        // so refresh the session: the header's View menu then shows its Subscribe link again.
        if (data.changed) refreshSession()
      },
      () => isCurrent && setStatus({ userId, subscribed: false }), // If it fails, just offer the button.
    )
    return () => {
      isCurrent = false
    }
  }, [userId])

  const isChecking = Boolean(userId) && status.userId !== userId // Signed in, but the answer hasn't arrived yet.

  async function handleSubscribe() {
    setIsSending(true)
    setError(null)
    try {
      await apiFetch('/api/subscription', { method: 'POST' })
      setStatus({ userId, subscribed: true })
      refreshSession() // The header's View menu then drops its Subscribe link.
    } catch (subscribeError) {
      setError(subscribeError)
    } finally {
      setIsSending(false) // "finally" runs whether it worked or not.
    }
  }

  // The gold "pill" style used for the button and the links in this section.
  const pillClasses =
    'inline-block cursor-pointer rounded-full bg-accent px-6 py-2.5 font-body font-semibold text-background transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-60'

  let content
  if (isPending || isChecking) {
    content = <p className="animate-pulse font-body text-muted">Loading&hellip;</p>
  } else if (!user) {
    content = (
      <>
        <p className="font-body text-text">Create a free account and tick &ldquo;Send me news&rdquo; to get new work and event updates by email.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a href="#/signup" className={pillClasses}>Create an Account</a>
          <a href="#/signin" className="font-body font-semibold text-accent underline hover:text-muted">I already have one</a>
        </div>
      </>
    )
  } else if (status.subscribed) {
    content = (
      // role="status" makes screen readers read this out when it appears (e.g. straight after subscribing).
      <p role="status" className="font-body text-text">
        <span className="text-accent">&#10003; You&rsquo;re subscribed.</span> We&rsquo;ll send news, new work and event updates to {user.email}.
        <a href="#/subscription" className="mt-1 block text-sm text-muted underline hover:text-accent">Manage your subscription</a>
      </p>
    )
  } else {
    content = (
      <>
        <p className="font-body text-text">Get new work, print releases and event updates sent to {user.email}.</p>
        {error && <p role="alert" className={errorClasses}>{error.message}</p>}
        <button type="button" onClick={handleSubscribe} disabled={isSending} className={`${pillClasses} mt-4`}>
          {isSending ? 'Subscribing…' : 'Subscribe'}
        </button>
      </>
    )
  }

  return (
    // id="subscribe" lets a link (#subscribe) jump here. A narrow, centred box, smaller than the forms above it.
    <section id="subscribe" className="mx-auto mt-6 mb-12 w-[calc(100%-2rem)] max-w-[560px] rounded-lg border-2 border-accent/40 p-5 text-center sm:w-full sm:p-6">
      <h2 className="mb-2 text-xl text-text sm:text-2xl">
        Stay In The <span className="text-muted">Loop.</span>
      </h2>
      {content}
    </section>
  )
}

export default SubscribeSection // Lets HomePage.jsx load this with: import SubscribeSection from '../components/SubscribeSection.jsx'
