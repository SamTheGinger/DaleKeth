import { useState } from 'react'
import { apiFetch } from '../utils/api.js'
import { authClient, refreshSession } from '../utils/authClient.js'
import useSubscriptionStatus from '../utils/useSubscriptionStatus.js'
import { errorClasses } from './formStyles.js'

const pillClasses =
  'inline-block cursor-pointer rounded-full bg-accent px-6 py-2.5 font-body font-semibold text-background transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-60'

// Compact subscribe prompt at the end of the home page. Full management lives on SubscriptionPage.
export default function SubscribeSection() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  // A failed status check is treated as "not subscribed", so the user can still subscribe.
  const { isChecking, subscribed, setSubscribed } = useSubscriptionStatus(user?.id)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubscribe() {
    setIsSending(true)
    setError(null)
    try {
      await apiFetch('/api/subscription', { method: 'POST' })
      setSubscribed(true)
      refreshSession()
    } catch (subscribeError) {
      setError(subscribeError)
    } finally {
      setIsSending(false)
    }
  }

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
  } else if (subscribed) {
    content = (
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
    <section id="subscribe" className="mx-auto mt-6 mb-12 w-[calc(100%-2rem)] max-w-[560px] rounded-lg border-2 border-accent/40 p-5 text-center sm:w-full sm:p-6">
      <h2 className="mb-2 text-xl text-text sm:text-2xl">
        Stay In The <span className="text-muted">Loop.</span>
      </h2>
      {content}
    </section>
  )
}
