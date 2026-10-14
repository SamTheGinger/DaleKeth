// App is the top of the whole website. It decides which page to show, and it remembers
// things that must survive moving between pages (favourites and likes).
import { useEffect, useState } from 'react' // Built-in React hooks: useState remembers values, useEffect runs code after drawing.
import Header from './components/Header.jsx' // The top bar (shown on every page).
import Footer from './components/Footer.jsx' // The bottom bar (shown on every page).
import HomePage from './pages/HomePage.jsx' // The main one-page site.
import GalleryPage from './pages/GalleryPage.jsx' // A photo's series of likeable images.
import ArtworkPage from './pages/ArtworkPage.jsx' // An artwork's sale page.
import EventPage from './pages/EventPage.jsx' // An event's booking page.
import NotFoundPage from './pages/NotFoundPage.jsx' // Shown for addresses that don't exist.
import photos from './data/photos.js' // The data lists, used to find the right item for each page.
import artworks from './data/artworks.js'
import events from './data/events.js'
import useHashRoute from './utils/useHashRoute.js' // Our tiny router: tells us which page the address points to.

// Adds an item to a list (when isOn is true) or removes it (when isOn is false), and gives back a NEW list.
// React needs a new list (not the old one changed) to notice that something changed.
// [...list, item] = "everything in list, plus item on the end".
// list.filter((x) => x !== item) = "everything in list except item" (!== means "is not equal to").
function updateList(list, item, isOn) {
  return isOn ? [...list, item] : list.filter((x) => x !== item)
}

function App() {
  const route = useHashRoute() // e.g. { page: 'gallery', id: 3 } or { page: 'home', anchor: 'portfolio' }.

  // These live here (not inside a page) so they're kept when you go from page to page.
  // They reset if the browser is refreshed, because nothing is saved to a server.
  const [favoriteIds, setFavoriteIds] = useState([]) // Ids of favourited portfolio photos, e.g. [1, 11].
  const [likedImageIds, setLikedImageIds] = useState([]) // Ids of liked gallery images, e.g. ['1-0', '3-2'].

  // Called by a Favourite button: add or remove one photo id.
  // Passing a function to setFavoriteIds gives us the very latest list (current) to work from.
  function handleFavoriteChange(id, isFavorite) {
    setFavoriteIds((current) => updateList(current, id, isFavorite))
  }

  // Called by a Like button: add or remove one image id.
  function handleLikeChange(imageId, isLiked) {
    setLikedImageIds((current) => updateList(current, imageId, isLiked))
  }

  // Scrolling: runs after the page has been drawn, every time the route changes.
  useEffect(() => {
    if (route.page === 'home' && route.anchor) {
      // On the home page with a section in the address (e.g. #events): scroll to that section.
      // This is needed when coming from another page, because the section didn't exist until now.
      // ?. means "only carry on if the thing before it was found", so a wrong id doesn't crash the page.
      document.getElementById(route.anchor)?.scrollIntoView()
    } else {
      // A new page (gallery, artwork, event): start at the top, instantly instead of a slow smooth scroll.
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [route]) // [route] = run this again whenever route changes.

  // Work out which page to show. "let" makes a box whose contents can be changed later (unlike const).
  let page
  if (route.page === 'gallery') {
    // .find() gives back the first photo whose id matches the number in the address (or undefined if none does).
    const photo = photos.find((p) => p.id === route.id)
    page = photo ? (
      <GalleryPage photo={photo} likedImageIds={likedImageIds} onLikeChange={handleLikeChange} />
    ) : (
      <NotFoundPage /> // No photo with that id, so show the "not found" page.
    )
  } else if (route.page === 'artwork') {
    const artwork = artworks.find((a) => a.id === route.id)
    // key={artwork.id} gives each artwork page a fresh start (quantity back to 1, form empty).
    page = artwork ? <ArtworkPage key={artwork.id} artwork={artwork} /> : <NotFoundPage />
  } else if (route.page === 'event') {
    const event = events.find((e) => e.id === route.id)
    page = event ? <EventPage key={event.id} event={event} /> : <NotFoundPage />
  } else if (route.page === 'home') {
    page = <HomePage favoriteIds={favoriteIds} onFavoriteChange={handleFavoriteChange} />
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
