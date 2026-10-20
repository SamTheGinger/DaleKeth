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
