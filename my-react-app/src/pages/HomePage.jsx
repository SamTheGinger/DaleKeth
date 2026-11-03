import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Portfolio from '../components/Portfolio.jsx'
import Shop from '../components/Shop.jsx'
import Events from '../components/Events.jsx'
import BookingForm from '../components/BookingForm.jsx'
import SubscribeSection from '../components/SubscribeSection.jsx'

export default function HomePage({ favoriteIds, onFavoriteChange, isSignedIn }) {
  return (
    <>
      <Hero />
      <About />
      <Portfolio favoriteIds={favoriteIds} onFavoriteChange={onFavoriteChange} isSignedIn={isSignedIn} />
      <Shop />
      <Events />
      <BookingForm />
      <SubscribeSection />
    </>
  )
}
