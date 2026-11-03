import FavoriteToggle from './FavoriteToggle.jsx'

export default function PhotoCard({ photo, isFavorite, onFavoriteChange }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-3xl border border-accent pb-4 text-center transition-transform duration-200 hover:-translate-y-2 min-[400px]:border-2 sm:rounded-[2rem]">
      <a href={`#/gallery/${photo.id}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-text">
        <img loading="lazy" decoding="async" src={photo.src} alt={photo.title} className="aspect-square w-full object-cover" />
        <h3 className="mx-2 mt-3 mb-1 text-xl font-semibold text-text transition-colors group-hover:text-accent sm:mx-4 sm:mt-4 sm:text-2xl md:text-[2rem]">
          {photo.title}
        </h3>
        <p className="mb-3 font-body text-sm font-semibold text-accent uppercase sm:text-base">
          {photo.category} · {photo.gallery.length} photos
        </p>
      </a>

      {/* Kept outside the link: interactive content can't be nested inside <a>. */}
      <FavoriteToggle isFavorite={isFavorite} onChange={(next) => onFavoriteChange(photo.id, next)} label={photo.title} />
    </article>
  )
}
