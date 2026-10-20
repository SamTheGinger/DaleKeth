// Small helpers for checking what the browser sent. Never trust the browser: anyone can send
// any request to the API, not only through our forms, so every value is checked here too.

// An error the route handlers throw on purpose. The error handler in app.js turns it into a JSON reply.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// '3' -> 3. Anything that isn't a whole number above 0 is a 404 (no such item).
export function parseId(value) {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw new HttpError(404, 'Not found.')
  return id
}

// A required piece of text, trimmed, with a sensible length limit.
export function text(value, label, maxLength = 200) {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  if (!trimmed) throw new HttpError(400, `${label} is required.`)
  if (trimmed.length > maxLength) throw new HttpError(400, `${label} is too long.`)
  return trimmed
}

export function email(value) {
  const address = text(value, 'Email', 254)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) throw new HttpError(400, 'Please enter a valid email address.')
  return address
}

export function wholeNumber(value, label, { min, max }) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new HttpError(400, `${label} must be between ${min} and ${max}.`)
  }
  return number
}
