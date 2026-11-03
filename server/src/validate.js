// Request validation helpers. Each returns the cleaned value or throws an HttpError,
// which the error handler in app.js turns into a JSON response.

export const MAX_SPOTS_PER_BOOKING = 10

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Route ids: anything that isn't a positive integer can't exist, so it's a 404 rather than a 400.
export function parseId(value) {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw new HttpError(404, 'Not found.')
  return id
}

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
