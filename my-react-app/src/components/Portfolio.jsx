import { useState } from 'react'
import { useApi } from '../utils/api.js'
import LoadState from './LoadState.jsx'
import PhotoCard from './PhotoCard.jsx'

const filters = ['All', 'Portrait', 'Landscape', 'Favourites']

// Favourites state lives in App so it survives navigation to gallery pages and back.
export default function Portfolio({ favoriteIds, onFavoriteChange, isSignedIn }) {
  const { data: photos, error, isLoading } = useApi('/api/photos')
  const [activeFilter, setActiveFilter] = useState('All')

  const visiblePhotos = (photos ?? []).filter((photo) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Favourites') return favoriteIds.includes(photo.id)
    return photo.category === activeFilter
  })

  return (
    <section id="portfolio" className="mx-auto mt-6 mb-12 w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="mb-6 text-center text-2xl text-text sm:mb-10 sm:text-3xl md:mb-12 md:text-4xl">
        Explore My <span className="text-muted">Portfolio.</span>
      </h2>

      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3" role="group" aria-label="Filter photos">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={`cursor-pointer rounded-full border-2 border-accent px-4 py-1.5 font-body text-sm font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text sm:px-5 sm:text-base ${
              activeFilter === filter ? 'bg-accent text-background' : 'text-accent hover:bg-accent/15'
            }`}
          >
            {filter}
            {filter === 'Favourites' && ` (${favoriteIds.length})`}
          </button>
        ))}
      </div>

      <LoadState isLoading={isLoading} error={error}>
        {visiblePhotos.length > 0 ? (
          <div className="mx-auto grid max-w-[26rem] grid-cols-1 gap-3 min-[400px]:gap-6 sm:max-w-none sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-12">
            {visiblePhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavorite={favoriteIds.includes(photo.id)}
                onFavoriteChange={onFavoriteChange}
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
