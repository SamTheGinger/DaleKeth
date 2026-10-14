import { formatPrice } from '../utils/format.js' // Helper that turns 2400 into "R 2 400".

// One card in the Shop grid. The whole card is a link to that artwork's sale page.
//
// Props (inputs from Shop.jsx):
//   artwork  one object from data/artworks.js ({ id, title, medium, price, src, ... }).
function ArtworkCard({ artwork }) {
  return (
    // The whole card is an <a> link to an address like #/artwork/2, which App.jsx turns into the sale page.
    // group = lets the children change when the card is hovered (see group-hover below).
    // flex flex-col = stack the image and text top to bottom.
    // The other classes match the portfolio cards: gold border, rounded corners, lifts on hover.
    <a
      href={`#/artwork/${artwork.id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-accent text-center transition-transform duration-200 hover:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text min-[400px]:border-2 sm:rounded-[2rem]"
    >
      {/* aspect-[4/5] = a slightly tall rectangle, like a framed print. object-cover = fill it without stretching. */}
      <img src={artwork.src} alt={artwork.title} className="aspect-[4/5] w-full object-cover" />
      {/* flex-1 = this text area stretches so every card in a row is the same height. */}
      <div className="flex flex-1 flex-col px-3 pt-3 pb-5 sm:px-4 sm:pt-4">
        <h3 className="text-xl font-semibold text-text transition-colors group-hover:text-accent sm:text-2xl">
          {artwork.title}
        </h3>
        <p className="mt-1 font-body text-sm text-muted">{artwork.medium}</p> {/* What it's made of, in grey. */}
        {/* mt-auto = pushes the price to the bottom of the card, even if the text above is short. */}
        <p className="mt-auto pt-3 font-body text-lg font-semibold text-accent">{formatPrice(artwork.price)}</p>
      </div>
    </a>
  )
}

export default ArtworkCard // Lets Shop.jsx load this with: import ArtworkCard from './ArtworkCard.jsx'
