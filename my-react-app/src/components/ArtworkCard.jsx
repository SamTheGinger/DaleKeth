import { formatPrice } from '../utils/format.js'

export default function ArtworkCard({ artwork }) {
  return (
    <a
      href={`#/artwork/${artwork.id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-accent text-center transition-transform duration-200 hover:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text min-[400px]:border-2 sm:rounded-[2rem]"
    >
      <img loading="lazy" decoding="async" src={artwork.src} alt={artwork.title} className="aspect-[4/5] w-full object-cover" />
      <div className="flex flex-1 flex-col px-3 pt-3 pb-5 sm:px-4 sm:pt-4">
        <h3 className="text-xl font-semibold text-text transition-colors group-hover:text-accent sm:text-2xl">
          {artwork.title}
        </h3>
        <p className="mt-1 font-body text-sm text-muted">{artwork.medium}</p>
        <p className="mt-auto pt-3 font-body text-lg font-semibold text-accent">{formatPrice(artwork.price)}</p>
      </div>
    </a>
  )
}
