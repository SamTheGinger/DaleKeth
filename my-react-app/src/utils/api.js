// HTTP client for the Express API. All paths are same-origin (/api/...): Vite proxies them in development
// and vercel.json rewrites them in production, so the session cookie is always first-party.
import { useEffect, useState } from 'react'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Returns the parsed JSON body (or null for 204). Throws ApiError with the server's message on failure;
// status 0 means the request never reached the server.
export async function apiFetch(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(path, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.')
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? 'Something went wrong. Please try again.')
  }
  return data
}

// Module-level cache for useApi: stale-while-revalidate, with concurrent requests for the same path deduplicated.
// Serving cached data immediately also keeps page height stable, so hash-anchor scrolling lands correctly.
const cache = new Map()
const inFlight = new Map()

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

// const { data, error, isLoading } = useApi('/api/photos')
export function useApi(path) {
  // The result is tagged with its path so a response for a previous path is never returned for the current one.
  const [result, setResult] = useState({ path: null, data: null, error: null })

  useEffect(() => {
    let isCurrent = true
    load(path).then(
      (data) => isCurrent && setResult({ path, data, error: null }),
      (error) => isCurrent && setResult({ path, data: null, error }),
    )
    return () => {
      isCurrent = false
    }
  }, [path])

  if (result.path === path) return { data: result.data, error: result.error, isLoading: false }
  if (cache.has(path)) return { data: cache.get(path), error: null, isLoading: false }
  return { data: null, error: null, isLoading: true }
}
