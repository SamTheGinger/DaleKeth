import { useEffect, useState } from 'react'
import { apiFetch } from './api.js'
import { refreshSession } from './authClient.js'

// Loads the signed-in user's email subscription status from GET /api/subscription.
//   isChecking      true until the status for the current user has loaded
//   subscribed      boolean
//   loadError       set if the status couldn't be loaded
//   setSubscribed   update after a successful POST/DELETE
export default function useSubscriptionStatus(userId) {
  // Tagged with the userId it belongs to, so a stale result never shows after switching accounts.
  const [status, setStatus] = useState({ userId: null, subscribed: false, loadError: null })

  useEffect(() => {
    if (!userId) return
    let isCurrent = true
    apiFetch('/api/subscription').then(
      (data) => {
        if (!isCurrent) return
        setStatus({ userId, subscribed: data.subscribed, loadError: null })
        // The server reconciled the account with Resend; refresh the session so the header updates too.
        if (data.changed) refreshSession()
      },
      (loadError) => isCurrent && setStatus({ userId, subscribed: false, loadError }),
    )
    return () => {
      isCurrent = false
    }
  }, [userId])

  const isCurrentUser = Boolean(userId) && status.userId === userId
  return {
    isChecking: Boolean(userId) && !isCurrentUser,
    subscribed: isCurrentUser && status.subscribed,
    loadError: isCurrentUser ? status.loadError : null,
    setSubscribed: (subscribed) => setStatus({ userId, subscribed, loadError: null }),
  }
}
