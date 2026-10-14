// The "Favourite" button on each portfolio card.
//
// This is a CONTROLLED component: it doesn't remember anything itself.
// Its parent tells it what to show (isFavorite) and gets told when it's clicked (onChange).
// That way the parent (App.jsx) holds every favourite in one place, which is what lets
// the "Favourites" filter button know which photos to show.
// Same pattern as QuantityStepper: a value comes in, a change goes out.

// The { isFavorite, onChange, label } part pulls three "props" (inputs) out of what the parent passes in:
//   isFavorite  true or false: is this photo currently a favourite?
//   onChange    a function to call with the NEW value when the button is clicked.
//   label       the photo's title, used to give the button a clear spoken name for screen readers.
function FavoriteToggle({ isFavorite, onChange, label }) {
  return ( // Everything inside return ( ) is JSX: HTML-like code that React turns into real page elements.
    <button
      type="button" // A plain button: it doesn't submit a form.
      aria-pressed={isFavorite} // Tells screen readers this is an on/off button and whether it's on.
      // The spoken name changes with the state. `...${label}...` is a "template string": ${ } drops a value into the text.
      // "condition ? A : B" means: if the condition is true use A, otherwise use B.
      aria-label={isFavorite ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      onClick={() => onChange(!isFavorite)} // When clicked, tell the parent the opposite of the current value (! means NOT).
      // className is JSX's name for the HTML class attribute. The classes are Tailwind utilities:
      // inline-flex + items-center + gap-2 = heart and text side by side with a small gap,
      // rounded-full = pill shape, border-2 border-accent = gold outline, px-4 py-1.5 = inner spacing,
      // focus-visible:outline-* = a clear ring when reached with the keyboard (Tab key).
      // The part inside ${ } adds different colours depending on whether it's a favourite:
      // on = solid gold with dark text, off = gold text that gets a faint gold tint on hover.
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-accent px-4 py-1.5 font-body text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
        isFavorite ? 'bg-accent text-background' : 'text-accent hover:bg-accent/15'
      }`}
    >
      {/* A filled heart when on, an empty heart when off. aria-hidden stops screen readers from reading the symbol out. */}
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      {isFavorite ? 'Favourited' : 'Favourite'} {/* The visible text, which also changes. */}
    </button>
  )
}

export default FavoriteToggle // Lets other files load this component with: import FavoriteToggle from './FavoriteToggle.jsx'
