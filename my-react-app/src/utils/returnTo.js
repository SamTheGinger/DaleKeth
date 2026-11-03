// Remembers where to send the user after signing in. Storage access is wrapped because some browsers
// (e.g. Safari private mode) throw; losing the redirect is harmless, so failures are ignored.
const KEY = 'returnTo'

export function rememberReturnTo(hash) {
  try {
    sessionStorage.setItem(KEY, hash)
  } catch {
    // Ignored: see above.
  }
}

export function takeReturnTo() {
  try {
    const hash = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    return hash
  } catch {
    return null
  }
}
