export default function LikeButton({ isLiked, onChange, label }) {
  return (
    <button
      type="button"
      aria-pressed={isLiked}
      aria-label={isLiked ? `Unlike ${label}` : `Like ${label}`}
      onClick={() => onChange(!isLiked)}
      className={`flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-accent text-2xl shadow-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text active:scale-90 ${
        isLiked ? 'bg-accent text-background' : 'bg-background/70 text-accent hover:bg-background/90'
      }`}
    >
      <span aria-hidden="true">{isLiked ? '♥' : '♡'}</span>
    </button>
  )
}
