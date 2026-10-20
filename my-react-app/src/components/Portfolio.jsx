import { useState } from 'react' // useState lets this component remember which filter button is selected.
import { useApi } from '../utils/api.js' // Loads data from the server.
import LoadState from './LoadState.jsx' // "Loading…" / error message while the photos arrive.
import PhotoCard from './PhotoCard.jsx' // The card used for each photo.

// The names of the filter buttons, in the order they appear.
const filters = ['All', 'Portrait', 'Landscape', 'Favourites']

// The portfolio section: a row of filter buttons above a grid of photo cards.
//
// Props (inputs from App.jsx):
//   favoriteIds       a list of the ids of every favourited photo, e.g. [1, 11].
//   onFavoriteChange  a function that adds or removes an id from that list.
//   isSignedIn        true when someone is signed in (favourites are saved to their account).
// The favourites are kept in App.jsx rather than here, so they aren't lost when
// you open a gallery page and come back.
function Portfolio({ favoriteIds, onFavoriteChange, isSignedIn }) {
  // Ask the server for every photo series. photos is null until the answer arrives.
  const { data: photos, error, isLoading } = useApi('/api/photos')

  // activeFilter = which button is selected right now. It starts as 'All'.
  // setActiveFilter = the function that changes it (and makes React redraw the grid).
  const [activeFilter, setActiveFilter] = useState('All')

  // .filter() goes through every photo and keeps only the ones where the function returns true.
  // (photos ?? []) = use an empty list while photos is still null.
  const visiblePhotos = (photos ?? []).filter((photo) => {
    if (activeFilter === 'All') return true // "All": keep every photo. (=== means "is exactly equal to".)
    if (activeFilter === 'Favourites') return favoriteIds.includes(photo.id) // Keep it only if its id is in the favourites list.
    return photo.category === activeFilter // 'Portrait' or 'Landscape': keep it if its category matches.
  })

  return (
    // id="portfolio" is what the menu's "Portfolio" link (#portfolio) jumps to.
    // mx-auto = centred, max-w-[1100px] = never wider than 1100px, w-full = otherwise full width,
    // px-4 / sm:px-6 = space at the sides (more from 640px up), py-6 / sm:py-8 = space above and below.
    <section id="portfolio" className="mx-auto mt-6 mb-12 w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      {/* Section heading. The <span> lets "Portfolio." be coloured grey (text-muted). */}
      <h2 className="mb-6 text-center text-2xl text-text sm:mb-10 sm:text-3xl md:mb-12 md:text-4xl">
        Explore My <span className="text-muted">Portfolio.</span>
      </h2>

      {/* The filter buttons. flex-wrap = they drop onto a new line if the screen is too narrow.
          role="group" + aria-label tell screen readers that these buttons belong together. */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3" role="group" aria-label="Filter photos">
        {/* .map() turns each name in the filters list into a <button>.
            key={filter} is a unique name React needs for every item in a list, so it can keep track of them. */}
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter} // Tells screen readers which button is currently selected.
            onClick={() => setActiveFilter(filter)} // Clicking a button makes it the active filter, which redraws the grid.
            // Selected button = solid gold. Others = gold outline that tints on hover.
            className={`cursor-pointer rounded-full border-2 border-accent px-4 py-1.5 font-body text-sm font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text sm:px-5 sm:text-base ${
              activeFilter === filter ? 'bg-accent text-background' : 'text-accent hover:bg-accent/15'
            }`}
          >
            {filter}
            {/* Only on the Favourites button: show how many favourites there are, e.g. "(2)".
                "A && B" means: only show B if A is true. */}
            {filter === 'Favourites' && ` (${favoriteIds.length})`}
          </button>
        ))}
      </div>

      {/* If at least one photo matches the filter, show the grid; otherwise show a friendly message. */}
      <LoadState isLoading={isLoading} error={error}>
      {visiblePhotos.length > 0 ? (
        // The grid is mobile-first: the class with no prefix is for phones, then each prefix adds a change for bigger screens.
        // grid-cols-1 = 1 column on phones (max 26rem wide, centred), sm:grid-cols-2 = 2 columns from 640px,
        // md:grid-cols-3 = 3 columns from 900px. gap-* = the space between cards.
        <div className="mx-auto grid max-w-[26rem] grid-cols-1 gap-3 min-[400px]:gap-6 sm:max-w-none sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-12">
          {/* One PhotoCard for each photo that passed the filter. */}
          {visiblePhotos.map((photo) => (
            <PhotoCard
              key={photo.id} // Unique key so React can track each card.
              photo={photo} // Hands the whole photo object to the card.
              isFavorite={favoriteIds.includes(photo.id)} // true if this photo's id is in the favourites list.
              onFavoriteChange={onFavoriteChange} // Passes App's function down so the card's button can update the list.
            />
          ))}
        </div>
      ) : (
        <p className="text-center font-body text-text">
          {isSignedIn ? (
            'No favourites yet. Tap the heart on a photo to add it here.'
          ) : (
            <>
              <a href="#/signin" className="font-semibold text-accent underline hover:text-muted">Sign in</a> to save your favourite photos.
            </>
          )}
        </p>
      )}
      </LoadState>
    </section>
  )
}

export default Portfolio // Lets HomePage.jsx load this with: import Portfolio from '../components/Portfolio.jsx'
