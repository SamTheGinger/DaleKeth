// The home page: every section, in the order they appear from top to bottom.
import Hero from '../components/Hero.jsx' // The big banner.
import Portfolio from '../components/Portfolio.jsx' // The filterable photo grid.
import About from '../components/About.jsx' // "The Woman Behind The Lens".
import Shop from '../components/Shop.jsx' // The artwork-for-sale grid.
import Events from '../components/Events.jsx' // Upcoming events.
import BookingForm from '../components/BookingForm.jsx' // Photoshoot booking form.

// Props (inputs from App.jsx): the favourites list and the function that changes it.
// HomePage doesn't use them itself; it just passes them on to Portfolio.
function HomePage({ favoriteIds, onFavoriteChange }) {
  return (
    // <> and </> are a "fragment": a wrapper that groups elements without adding an extra box to the page.
    <>
      <Hero />
      <Portfolio favoriteIds={favoriteIds} onFavoriteChange={onFavoriteChange} />
      <About />
      <Shop />
      <Events />
      <BookingForm />
    </>
  )
}

export default HomePage // Lets App.jsx load this with: import HomePage from './pages/HomePage.jsx'
