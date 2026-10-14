import FavoriteToggle from './FavoriteToggle.jsx' // Loads the Favourite button component from the same folder.

// One card in the portfolio grid. Clicking the picture or title opens that photo's gallery page.
//
// Props (inputs from Portfolio.jsx):
//   photo             one object from data/photos.js ({ id, title, category, src, gallery }).
//   isFavorite        true or false: has this photo been favourited?
//   onFavoriteChange  a function to call when the Favourite button is clicked.
function PhotoCard({ photo, isFavorite, onFavoriteChange }) {
  return (
    // <article> = a self-contained piece of content (good for screen readers and search engines).
    // min-w-0 = lets the card shrink inside the grid instead of pushing the page wider than the screen.
    // overflow-hidden = the image is clipped to the card's rounded corners.
    // rounded-3xl / sm:rounded-[2rem] = corner roundness (smaller on phones, bigger from 640px).
    // border / min-[400px]:border-2 = 1px gold border on tiny phones, 2px from 400px wide.
    // hover:-translate-y-2 = the card lifts 8px when the mouse is over it; transition-transform makes that smooth.
    <article className="min-w-0 overflow-hidden rounded-3xl border border-accent pb-4 text-center transition-transform duration-200 hover:-translate-y-2 min-[400px]:border-2 sm:rounded-[2rem]">
      {/* The link wraps the image and text so the whole top of the card is clickable.
          `#/gallery/${photo.id}` builds an address like #/gallery/3, which App.jsx turns into the gallery page.
          "group" lets the children react when the link itself is hovered (see group-hover below). */}
      <a href={`#/gallery/${photo.id}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-text">
        {/* aspect-square = always a perfect square, object-cover = fill the square without stretching (the edges get cropped). */}
        <img src={photo.src} alt={photo.title} className="aspect-square w-full object-cover" />
        {/* The title. text-xl → sm:text-2xl → md:text-[2rem] = bigger on bigger screens.
            group-hover:text-accent = turns gold when the link is hovered. */}
        <h3 className="mx-2 mt-3 mb-1 text-xl font-semibold text-text transition-colors group-hover:text-accent sm:mx-4 sm:mt-4 sm:text-2xl md:text-[2rem]">
          {photo.title}
        </h3>
        {/* The category plus how many images are in the series. photo.gallery.length counts the items in the list. */}
        <p className="mb-3 font-body text-sm font-semibold text-accent uppercase sm:text-base">
          {photo.category} · {photo.gallery.length} photos
        </p>
      </a>

      {/* The Favourite button sits outside the link: a button inside a link is invalid HTML and confusing to click.
          When it changes, we call onFavoriteChange with this photo's id and the new true/false value. */}
      <FavoriteToggle
        isFavorite={isFavorite}
        onChange={(next) => onFavoriteChange(photo.id, next)}
        label={photo.title}
      />
    </article>
  )
}

export default PhotoCard // Lets Portfolio.jsx load this with: import PhotoCard from './PhotoCard.jsx'
