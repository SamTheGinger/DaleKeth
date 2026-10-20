// App is the top of the whole website. It decides which page to show, and it remembers
// things that must survive moving between pages (favourites and likes).
import { useEffect, useState } from 'react' // Built-in React hooks: useState remembers values, useEffect runs code after drawing.
import Header from './components/Header.jsx' // The top bar (shown on every page).
import Footer from './components/Footer.jsx' // The bottom bar (shown on every page).
import LoadState from './components/LoadState.jsx' // "Loading…" / error message while a page's data arrives.
import HomePage from './pages/HomePage.jsx' // The main one-page site.
import GalleryPage from './pages/GalleryPage.jsx' // A photo's series of likeable images.
import ArtworkPage from './pages/ArtworkPage.jsx' // An artwork's sale page.
import EventPage from './pages/EventPage.jsx' // An event's booking page.
import AuthPage from './pages/AuthPage.jsx' // Sign in / create account.
import NotFoundPage from './pages/NotFoundPage.jsx' // Shown for addresses that don't exist.
import useHashRoute from './utils/useHashRoute.js' // Our tiny router: tells us which page the address points to.
import { apiFetch, useApi } from './utils/api.js' // Talking to the server.
import { authClient } from './utils/authClient.js' // Who (if anyone) is signed in.

// Adds an item to a list (when isOn is true) or removes it (when isOn is false), and gives back a NEW list.
// React needs a new list (not the old one changed) to notice that something changed.
// [...list, item] = "everything in list, plus item on the end".
// list.filter((x) => x !== item) = "everything in list except item" (!== means "is not equal to").
function updateList(list, item, isOn) {
  return isOn ? [...list, item] : list.filter((x) => x !== item)
}

// Loads the one item a detail page needs (e.g. /api/photos/3) and then draws the page with it.
// children is a function: it's given the item and gives back the page to show.
// If the server says 404 (no such item), show the "not found" page.
function ItemPage({ path, children }) {
  const { data, error, isLoading } = useApi(path)
  if (error?.status === 404) return <NotFoundPage />
  return (
    <LoadState isLoading={isLoading} error={error}>
      {data && children(data)}
    </LoadState>
  )
}

function App() {
  const route = useHashRoute() // e.g. { page: 'gallery', id: 3 } or { page: 'home', anchor: 'portfolio' }.
  const userId = authClient.useSession().data?.user.id // The signed-in user's id, or undefined.

  // Favourites are saved to the signed-in user's account in the database.
  // We remember whose list it is, so a list never shows for the wrong person after signing out and in again.
  const [favorites, setFavorites] = useState({ userId: null, ids: [] })
  const favoriteIds = userId && favorites.userId === userId ? favorites.ids : [] // e.g. [1, 11]. Empty when signed out.

  // Likes are still only kept in the browser while the site is open (they reset on refresh).
  const [likedImageIds, setLikedImageIds] = useState([]) // Ids of liked gallery images, e.g. ['1-0', '3-2'].

  // Whenever someone signs in (userId changes), load their favourites from the server.
  useEffect(() => {
    if (!userId) return
    let isCurrent = true // Ignore the answer if the user changed before it arrived.
    apiFetch('/api/favorites').then(
      (ids) => isCurrent && setFavorites({ userId, ids }),
      () => {}, // If it fails, the hearts just start empty. Clicking one will show if the server is down.
    )
    return () => {
      isCurrent = false
    }
  }, [userId])

  // Called by a Favourite button: add or remove one photo id.
  async function handleFavoriteChange(id, isFavorite) {
    if (!userId) {
      window.location.hash = '#/signin' // Favourites belong to an account, so visitors are asked to sign in first.
      return
    }
    // Change the heart straight away so the site feels instant ("optimistic update")...
    setFavorites((current) => ({ userId, ids: updateList(current.ids, id, isFavorite) }))
    try {
      // ...then tell the server. PUT adds the favourite, DELETE removes it.
      await apiFetch(`/api/favorites/${id}`, { method: isFavorite ? 'PUT' : 'DELETE' })
    } catch {
      // The server didn't save it, so put the heart back the way it was.
      setFavorites((current) => ({ userId, ids: updateList(current.ids, id, !isFavorite) }))
    }
  }

  // Called by a Like button: add or remove one image id.
  function handleLikeChange(imageId, isLiked) {
    setLikedImageIds((current) => updateList(current, imageId, isLiked))
  }

  // The home page's three lists. Loading them here too means they're fetched straight away, even if
  // someone opens a gallery link first, and tells us when the home page has its full height (see below).
  // The sections share these requests (useApi never asks for the same address twice at once).
  const homeLists = [useApi('/api/photos'), useApi('/api/artworks'), useApi('/api/events')]
  const isHomeLoaded = homeLists.every((list) => !list.isLoading)

  // Scrolling, part 1: runs after the page has been drawn, every time the route changes.
  useEffect(() => {
    if (route.page !== 'home' || !route.anchor) {
      // A new page (gallery, artwork, event): start at the top, instantly instead of a slow smooth scroll.
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route]) // [route] = run this again whenever route changes.

  // Scrolling, part 2: on the home page with a section in the address (e.g. #events), scroll to that section.
  // This is needed when coming from another page, because the section didn't exist until now.
  // It runs again when the home lists finish loading: until then the sections above are short,
  // so #events would be scrolled to too early and then pushed further down the page.
  useEffect(() => {
    if (route.page === 'home' && route.anchor) {
      // ?. means "only carry on if the thing before it was found", so a wrong id doesn't crash the page.
      document.getElementById(route.anchor)?.scrollIntoView()
    }
  }, [route, isHomeLoaded])

  // Work out which page to show. "let" makes a box whose contents can be changed later (unlike const).
  let page
  if (route.page === 'gallery') {
    page = (
      <ItemPage path={`/api/photos/${route.id}`}>
        {(photo) => <GalleryPage photo={photo} likedImageIds={likedImageIds} onLikeChange={handleLikeChange} />}
      </ItemPage>
    )
  } else if (route.page === 'artwork') {
    page = (
      // key={artwork.id} gives each artwork page a fresh start (quantity back to 1, form empty).
      <ItemPage path={`/api/artworks/${route.id}`}>{(artwork) => <ArtworkPage key={artwork.id} artwork={artwork} />}</ItemPage>
    )
  } else if (route.page === 'event') {
    page = <ItemPage path={`/api/events/${route.id}`}>{(event) => <EventPage key={event.id} event={event} />}</ItemPage>
  } else if (route.page === 'signin' || route.page === 'signup') {
    page = <AuthPage key={route.page} mode={route.page} /> // key = a fresh, empty form when switching between the two.
  } else if (route.page === 'home') {
    page = <HomePage favoriteIds={favoriteIds} onFavoriteChange={handleFavoriteChange} isSignedIn={Boolean(userId)} />
  } else {
    page = <NotFoundPage /> // An address like #/something-else that we don't have a page for.
  }

  return (
    // <> </> is a "fragment": it groups elements without adding an extra box to the page.
    <>
      <Header />
      <main>{page}</main> {/* <main> holds whichever page we picked above. */}
      <Footer />
    </>
  )
}

export default App // Lets main.jsx load this with: import App from './App.jsx'
