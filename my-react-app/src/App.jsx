import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import LoadState from './components/LoadState.jsx'
import HomePage from './pages/HomePage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import ArtworkPage from './pages/ArtworkPage.jsx'
import EventPage from './pages/EventPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import useHashRoute from './utils/useHashRoute.js'
import { apiFetch, useApi } from './utils/api.js'
import { authClient } from './utils/authClient.js'

function toggleInList(list, item, isOn) {
  return isOn ? [...list, item] : list.filter((x) => x !== item)
}

// Fetches a single resource and renders `children(data)`, or the 404 page if it doesn't exist.
function ItemPage({ path, children }) {
  const { data, error, isLoading } = useApi(path)
  if (error?.status === 404) return <NotFoundPage />
  return (
    <LoadState isLoading={isLoading} error={error}>
      {data && children(data)}
    </LoadState>
  )
}

export default function App() {
  const route = useHashRoute()
  const userId = authClient.useSession().data?.user.id

  // Favourites are persisted per account. Tagging the list with its owner prevents a previous
  // user's favourites flashing after an account switch.
  const [favorites, setFavorites] = useState({ userId: null, ids: [] })
  const favoriteIds = userId && favorites.userId === userId ? favorites.ids : []

  // Gallery likes are session-only (not persisted).
  const [likedImageIds, setLikedImageIds] = useState([])

  useEffect(() => {
    if (!userId) return
    let isCurrent = true
    apiFetch('/api/favorites').then(
      (ids) => isCurrent && setFavorites({ userId, ids }),
      () => {}, // Non-critical: hearts start empty, and a failed toggle will surface the error.
    )
    return () => {
      isCurrent = false
    }
  }, [userId])

  async function handleFavoriteChange(id, isFavorite) {
    if (!userId) {
      window.location.hash = '#/signin'
      return
    }
    // Optimistic update, reverted if the request fails.
    setFavorites((current) => ({ userId, ids: toggleInList(current.ids, id, isFavorite) }))
    try {
      await apiFetch(`/api/favorites/${id}`, { method: isFavorite ? 'PUT' : 'DELETE' })
    } catch {
      setFavorites((current) => ({ userId, ids: toggleInList(current.ids, id, !isFavorite) }))
    }
  }

  function handleLikeChange(imageId, isLiked) {
    setLikedImageIds((current) => toggleInList(current, imageId, isLiked))
  }

  // Prefetch the home page's data at the app level so it's ready (and cached) regardless of the entry route,
  // and so we know when the home page has reached its full height for anchor scrolling below.
  const homeLists = [useApi('/api/photos'), useApi('/api/artworks'), useApi('/api/events')]
  const isHomeLoaded = homeLists.every((list) => !list.isLoading)

  useEffect(() => {
    if (route.page !== 'home' || !route.anchor) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route])

  // Anchor scrolling has to be re-run once the home lists load: before then the sections above are
  // shorter and the target would be pushed down after scrolling.
  useEffect(() => {
    if (route.page === 'home' && route.anchor) {
      document.getElementById(route.anchor)?.scrollIntoView()
    }
  }, [route, isHomeLoaded])

  let page
  if (route.page === 'gallery') {
    page = (
      <ItemPage path={`/api/photos/${route.id}`}>
        {(photo) => <GalleryPage photo={photo} likedImageIds={likedImageIds} onLikeChange={handleLikeChange} />}
      </ItemPage>
    )
  } else if (route.page === 'artwork') {
    page = <ItemPage path={`/api/artworks/${route.id}`}>{(artwork) => <ArtworkPage key={artwork.id} artwork={artwork} />}</ItemPage>
  } else if (route.page === 'event') {
    page = <ItemPage path={`/api/events/${route.id}`}>{(event) => <EventPage key={event.id} event={event} />}</ItemPage>
  } else if (route.page === 'order') {
    page = <OrderPage key={route.id} orderId={route.id} />
  } else if (route.page === 'subscription') {
    page = <SubscriptionPage />
  } else if (route.page === 'signin' || route.page === 'signup') {
    page = <AuthPage key={route.page} mode={route.page} />
  } else if (route.page === 'home') {
    page = <HomePage favoriteIds={favoriteIds} onFavoriteChange={handleFavoriteChange} isSignedIn={Boolean(userId)} />
  } else {
    page = <NotFoundPage />
  }

  return (
    <>
      <Header />
      <main>{page}</main>
      <Footer />
    </>
  )
}
