import { useApi } from '../utils/api.js' // Loads data from the server.
import LoadState from './LoadState.jsx' // "Loading…" / error message while the artwork arrives.
import ArtworkCard from './ArtworkCard.jsx' // The card used for each artwork.

// The Shop section on the home page: a heading, a short intro and a grid of artwork cards.
// The artwork comes from the database (GET /api/artworks). To add a piece, add it to
// server/db/seed-data/artworks.js and run `npm run db:seed` in the server folder.
function Shop() {
  const { data: artworks, error, isLoading } = useApi('/api/artworks')

  return (
    // id="shop" is where the menu's "Shop" link (#shop) jumps to.
    // Same width and spacing as the portfolio section, so the page lines up.
    <section id="shop" className="mx-auto mb-12 w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="mb-3 text-center text-2xl text-text sm:text-3xl md:text-4xl">
        Shop My <span className="text-muted">Artwork.</span>
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-center font-body text-text sm:mb-10">
        Signed prints and original pieces, made to order in Durban. Tap a piece to see the details and buy.
      </p>

      <LoadState isLoading={isLoading} error={error}>
      {/* Mobile-first grid: 1 column on phones, 2 from 640px (sm:), 3 from 900px (md:). */}
      <div className="mx-auto grid max-w-[26rem] grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-12">
        {/* .map() makes one ArtworkCard for every item in the artworks list. key = unique id React needs for lists. */}
        {artworks?.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      </LoadState>
    </section>
  )
}

export default Shop // Lets HomePage.jsx load this with: import Shop from '../components/Shop.jsx'
