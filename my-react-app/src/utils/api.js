// Everything the React app needs to talk to the Express API.
// Addresses start with /api. In development Vite forwards them to the server (vite.config.js);
// on Vercel, vercel.json forwards them to Railway. Either way the browser thinks it's the same website.
import { useEffect, useState } from 'react'

// An error that remembers the HTTP status (404, 409, ...) so pages can react to it.
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Calls the API and gives back the JSON reply. Throws an ApiError when the server says something went wrong.
//   apiFetch('/api/photos')
//   apiFetch('/api/favorites/3', { method: 'PUT' })
//   apiFetch('/api/photoshoot-bookings', { method: 'POST', body: { name, email } })
export async function apiFetch(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(path, {
      method,
      credentials: 'include', // Send the sign-in cookie, so the server knows who you are.
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined, // Objects have to be turned into text to be sent.
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.')
  }

  if (response.status === 204) return null // 204 = success with nothing to send back.
  const data = await response.json().catch(() => null) // Some error replies may not be JSON.
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? 'Something went wrong. Please try again.')
  }
  return data
}

// The last answer for each address, e.g. '/api/photos' -> [...]. When you come back to a page,
// it's drawn straight away from here while a fresh copy loads in the background. Without it, the
// home page would be empty for a moment and "scroll to #events" would land in the wrong place.
const cache = new Map()
const inFlight = new Map() // Requests still on their way, so two components asking for the same address share one request.

function load(path) {
  if (!inFlight.has(path)) {
    const request = apiFetch(path)
      .then((data) => {
        cache.set(path, data)
        return data
      })
      .finally(() => inFlight.delete(path))
    inFlight.set(path, request)
  }
  return inFlight.get(path)
}

// A hook that loads one address and redraws when the answer arrives.
//   const { data, error, isLoading } = useApi('/api/photos')
// When the path changes (e.g. a different gallery), it loads the new one.
export function useApi(path) {
  // We store which path the result belongs to. If it doesn't match the path we were given,
  // that answer is old (or hasn't arrived yet).
  const [result, setResult] = useState({ path: null, data: null, error: null })

  useEffect(() => {
    let isCurrent = true // Set to false if the path changes before the answer arrives, so a slow, old answer is ignored.
    load(path).then(
      (data) => isCurrent && setResult({ path, data, error: null }),
      (error) => isCurrent && setResult({ path, data: null, error }),
    )
    return () => {
      isCurrent = false
    }
  }, [path])

  if (result.path === path) return { data: result.data, error: result.error, isLoading: false }
  if (cache.has(path)) return { data: cache.get(path), error: null, isLoading: false } // Show the last answer meanwhile.
  return { data: null, error: null, isLoading: true }
}
