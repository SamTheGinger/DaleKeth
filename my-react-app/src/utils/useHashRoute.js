// Minimal hash router.
//   #/gallery/3   -> { page: 'gallery', id: 3 }
//   #/signin      -> { page: 'signin', id: NaN }
//   #portfolio    -> { page: 'home', anchor: 'portfolio' }   (home page, scrolled to a section)
import { useEffect, useState } from 'react'

function readRoute() {
  const hash = window.location.hash
  if (hash.startsWith('#/')) {
    const [page, id] = hash.slice(2).split('/')
    return { page, id: Number(id) }
  }
  return { page: 'home', anchor: hash.slice(1) }
}

export default function useHashRoute() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}
