// The round heart button that sits on top of each image in a gallery series.
// Like FavoriteToggle, it's a CONTROLLED component: the parent (App.jsx) remembers which
// images are liked and passes that in, so likes are kept when you move between pages.
//
// Props (inputs from the parent):
//   isLiked   true or false: is this image liked right now?
//   onChange  a function to call with the new true/false value when clicked.
//   label     a short description of the image, for screen readers ("Copper, image 2").
function LikeButton({ isLiked, onChange, label }) {
  return (
    <button
      type="button" // A plain button, not a form submit button.
      aria-pressed={isLiked} // Tells screen readers it's an on/off button and whether it's on.
      aria-label={isLiked ? `Unlike ${label}` : `Like ${label}`} // The name a screen reader says out loud.
      onClick={() => onChange(!isLiked)} // Tell the parent the opposite of the current value.
      // flex + items-center + justify-center = centre the heart inside the button,
      // size-12 = 48px wide and tall, rounded-full = a perfect circle, text-2xl = a big heart,
      // shadow-lg = a soft shadow so it stands out on light photos,
      // active:scale-90 = shrinks a little while pressed, which feels like a tap.
      // Liked = solid gold with a dark heart. Not liked = see-through dark with a gold heart.
      className={`flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-accent text-2xl shadow-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text active:scale-90 ${
        isLiked ? 'bg-accent text-background' : 'bg-background/70 text-accent hover:bg-background/90'
      }`}
    >
      <span aria-hidden="true">{isLiked ? '♥' : '♡'}</span> {/* Filled or empty heart. Hidden from screen readers, who hear the aria-label instead. */}
    </button>
  )
}

export default LikeButton // Lets GalleryPage load this with: import LikeButton from '../components/LikeButton.jsx'
