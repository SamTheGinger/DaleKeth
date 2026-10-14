import artworks from '../data/artworks.js' // The list of artwork for sale.
import ArtworkCard from './ArtworkCard.jsx' // The card used for each artwork.

// The Shop section on the home page: a heading, a short intro and a grid of artwork cards.
// To add more artwork to this grid, add it to data/artworks.js. Nothing here needs changing.
function Shop() {
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

      {/* Mobile-first grid: 1 column on phones, 2 from 640px (sm:), 3 from 900px (md:). */}
      <div className="mx-auto grid max-w-[26rem] grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-12">
        {/* .map() makes one ArtworkCard for every item in the artworks list. key = unique id React needs for lists. */}
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  )
}

export default Shop // Lets HomePage.jsx load this with: import Shop from '../components/Shop.jsx'
