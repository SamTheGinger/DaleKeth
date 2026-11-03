// Better Auth browser client (server counterpart: server/src/auth.js).
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: window.location.origin,
})

// Re-fetches the session for every useSession() consumer. Call after changing user fields outside
// Better Auth (e.g. marketingOptIn via /api/subscription). Uses Better Auth's internal session signal,
// the same mechanism its own plugins use.
export function refreshSession() {
  authClient.$store.notify('$sessionSignal')
}
