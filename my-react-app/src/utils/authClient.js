// The browser half of Better Auth (the server half is server/src/auth.js).
// It calls /api/auth/... for us and keeps track of who is signed in.
//
//   authClient.useSession()                          -> { data: { user, session } or null, isPending }
//   authClient.signUp.email({ name, email, password })
//   authClient.signIn.email({ email, password })
//   authClient.signOut()
//
// useSession() is shared: every component that calls it sees the same user and updates together
// when someone signs in or out.
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  // The API lives at /api on this same website (see utils/api.js), so we point at our own address.
  baseURL: window.location.origin,
})

// Asks the server for the session again, and updates every component using useSession() (the Header,
// the forms, App.jsx). Call it after changing something on the account outside Better Auth, such as
// subscribing to the emails, so the whole site sees the change. ($sessionSignal is Better Auth's own
// "the session changed" signal; its plugins use the same call.)
export function refreshSession() {
  authClient.$store.notify('$sessionSignal')
}
