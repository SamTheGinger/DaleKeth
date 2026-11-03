export default function FavoriteToggle({ isFavorite, onChange, label }) {
  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      onClick={() => onChange(!isFavorite)}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-accent px-4 py-1.5 font-body text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
        isFavorite ? 'bg-accent text-background' : 'text-accent hover:bg-accent/15'
      }`}
    >
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      {isFavorite ? 'Favourited' : 'Favourite'}
    </button>
  )
}
