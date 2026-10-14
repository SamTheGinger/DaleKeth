import LikeButton from '../components/LikeButton.jsx' // The round heart button shown on each image.

// The page that opens when a portfolio card is clicked: every image in that photo's series,
// each with a heart you can tap to like it.
// To add images to a series, add their paths to the "gallery" list in data/photos.js.
//
// Props (inputs from App.jsx):
//   photo          the photo object for this page (from data/photos.js).
//   likedImageIds  a list of every liked image's id, e.g. ['1-0', '1-2'].
//   onLikeChange   a function that adds or removes an image id from that list.
function GalleryPage({ photo, likedImageIds, onLikeChange }) {
  // Give every image in the series its own id: the photo's id, a dash, and the image's position.
  // e.g. the 3rd image of photo 1 becomes '1-2' (counting starts at 0).
  // .map() turns the list of paths into a list of objects with an id, a path (src) and a description (alt).
  const images = photo.gallery.map((src, index) => ({
    id: `${photo.id}-${index}`,
    src: src,
    alt: `${photo.title}, image ${index + 1} of ${photo.gallery.length}`, // e.g. "Copper, image 2 of 4"
  }))

  // Count how many images in THIS series are liked: keep only the liked ones, then count them.
  const likedCount = images.filter((image) => likedImageIds.includes(image.id)).length

  return (
    // The page area: centred, max 1100px wide, with space around it.
    <section className="mx-auto w-full max-w-275 px-4 py-8 sm:px-6 sm:py-12">
      {/* "Back" link. #portfolio takes you to the home page and scrolls to the portfolio section.
          &larr; is the HTML code for a left arrow (←). */}
      <a href="#portfolio" className="font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Portfolio
      </a>

      {/* The page heading area, centred. */}
      <div className="mt-6 mb-8 text-center sm:mb-12">
        <p className="font-body text-sm font-semibold tracking-[0.15rem] text-accent uppercase">{photo.category} series</p>
        {/* <h1> = the main heading of this page. */}
        <h1 className="mt-2 text-4xl text-text sm:text-5xl md:text-6xl">
          {photo.title}<span className="text-muted">.</span>
        </h1>
        <p className="mt-3 font-body text-text">
          {/* e.g. "You've liked 2 of 4 images. Tap a heart to like one." */}
          You&rsquo;ve liked {likedCount} of {images.length} images. Tap a heart to like one.
        </p>
      </div>

      {/* The images. Mobile-first: 1 column on phones, 2 from 640px (sm:), 3 from 900px (md:). */}
      <div className="mx-auto grid max-w-104 grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 md:grid-cols-3">
        {images.map((image) => (
          // <figure> = an image with something attached to it.
          // relative = lets the heart button be positioned in this figure's corner (see "absolute" below).
          <figure key={image.id} className="relative min-w-0 overflow-hidden rounded-3xl border-2 border-accent">
            {/* loading="lazy" = only download this image when it is about to scroll into view, so the page opens faster.
                decoding="async" = let the browser unpack the image in the background without freezing the page. */}
            <img loading="lazy" decoding="async" src={image.src} alt={image.alt} className="aspect-4/5 w-full object-cover" />
            {/* absolute + right-3 + bottom-3 = pinned 12px from the bottom-right corner of the image. */}
            <div className="absolute right-3 bottom-3">
              <LikeButton
                isLiked={likedImageIds.includes(image.id)} // true if this image's id is in the liked list.
                onChange={(next) => onLikeChange(image.id, next)} // Tell App.jsx to add or remove this image.
                label={image.alt}
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default GalleryPage // Lets App.jsx load this with: import GalleryPage from './pages/GalleryPage.jsx'
