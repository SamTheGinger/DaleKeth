import LikeButton from '../components/LikeButton.jsx'

// A portfolio series (#/gallery/:id). Image ids are "<photoId>-<index>" so likes are unique across series.
export default function GalleryPage({ photo, likedImageIds, onLikeChange }) {
  const images = photo.gallery.map((src, index) => ({
    id: `${photo.id}-${index}`,
    src,
    alt: `${photo.title}, image ${index + 1} of ${photo.gallery.length}`,
  }))
  const likedCount = images.filter((image) => likedImageIds.includes(image.id)).length

  return (
    <section className="mx-auto w-full max-w-275 px-4 py-8 sm:px-6 sm:py-12">
      <a href="#portfolio" className="font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Portfolio
      </a>

      <div className="mt-6 mb-8 text-center sm:mb-12">
        <p className="font-body text-sm font-semibold tracking-[0.15rem] text-accent uppercase">{photo.category} series</p>
        <h1 className="mt-2 text-4xl text-text sm:text-5xl md:text-6xl">
          {photo.title}<span className="text-muted">.</span>
        </h1>
        <p className="mt-3 font-body text-text">
          You&rsquo;ve liked {likedCount} of {images.length} images. Tap a heart to like one.
        </p>
      </div>

      <div className="mx-auto grid max-w-104 grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 md:grid-cols-3">
        {images.map((image) => (
          <figure key={image.id} className="relative min-w-0 overflow-hidden rounded-3xl border-2 border-accent">
            <img loading="lazy" decoding="async" src={image.src} alt={image.alt} className="aspect-4/5 w-full object-cover" />
            <div className="absolute right-3 bottom-3">
              <LikeButton
                isLiked={likedImageIds.includes(image.id)}
                onChange={(next) => onLikeChange(image.id, next)}
                label={image.alt}
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  )
}
