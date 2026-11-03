import { useApi } from '../utils/api.js'
import LoadState from './LoadState.jsx'
import ArtworkCard from './ArtworkCard.jsx'

export default function Shop() {
  const { data: artworks, error, isLoading } = useApi('/api/artworks')

  return (
    <section id="shop" className="mx-auto mb-12 w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="mb-3 text-center text-2xl text-text sm:text-3xl md:text-4xl">
        Shop My <span className="text-muted">Artwork.</span>
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-center font-body text-text sm:mb-10">
        Signed prints and original pieces, made to order in Durban. Tap a piece to see the details and buy.
      </p>

      <LoadState isLoading={isLoading} error={error}>
        <div className="mx-auto grid max-w-[26rem] grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-12">
          {artworks?.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </LoadState>
    </section>
  )
}
