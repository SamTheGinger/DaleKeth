// Five stars that show a rating, e.g. 4.8 out of 5. Used by the Testimonials section.
//
// Props:
//   value      the rating, 0 to 5. Halves and decimals work too (4.8 fills most of the fifth star).
//   className  extra Tailwind classes, mostly the size (e.g. "text-2xl").
//
// How it works: two rows of ★★★★★ sit on top of each other. The bottom row is grey; the top row is gold
// and cut off at value / 5 of the width, so exactly that much of the stars is gold.
function StarRating({ value, className = '' }) {
  const percent = Math.max(0, Math.min(5, value)) * 20 // 4.8 stars -> 96% of the width.

  return (
    // role="img" + aria-label: screen readers read "Rated 4.8 out of 5" instead of "star star star star star".
    <span role="img" aria-label={`Rated ${Number(value.toFixed(1))} out of 5`} className={`relative inline-block leading-none tracking-[0.1em] ${className}`}>
      <span aria-hidden="true" className="text-muted/40">★★★★★</span>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-accent" style={{ width: `${percent}%` }}>
        ★★★★★
      </span>
    </span>
  )
}

export default StarRating // Lets other files load this with: import StarRating from './StarRating.jsx'
