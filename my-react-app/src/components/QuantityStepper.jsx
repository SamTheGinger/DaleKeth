// A − 1 + control for choosing how many of something you want
// (how many prints to buy, or how many spots to book at an event).
//
// It's a CONTROLLED component: the parent page keeps the number in its own state and passes
// it in as `value`. When − or + is clicked, the stepper calls `onChange` with the new number,
// and the parent decides whether to store it. The parent can then use the same number
// to work out the total price.
//
// Props (inputs from the parent):
//   value     the number to show.
//   onChange  a function to call with the new number.
//   min       the lowest number allowed (1 unless the parent says otherwise).
//   max       the highest number allowed (e.g. how many prints are left).
//   label     what is being counted, for screen readers (e.g. "Number of prints").
function QuantityStepper({ value, onChange, min = 1, max, label }) { // "min = 1" gives min a default value if the parent doesn't pass one.
  // The same classes are used for both buttons, so they're stored once in a variable.
  // size-11 = 44px square (big enough to tap on a phone), rounded-full = circle,
  // disabled:opacity-40 + disabled:cursor-not-allowed = faded with a "no" cursor when the button can't be used.
  const buttonClasses =
    'flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-accent font-body text-xl font-bold text-accent transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

  return (
    // role="group" + aria-label tell screen readers these three things belong together.
    // inline-flex + items-center + gap-3 = the three pieces sit in a row with space between them
    // (min-[360px]:gap-4 = a little more space once the screen is 360px or wider; tiny phones need the room).
    <div role="group" aria-label={label} className="inline-flex items-center gap-3 min-[360px]:gap-4">
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(value - 1)} // Ask the parent to set the number one lower.
        disabled={value <= min} // Can't go below the minimum: the button is switched off when we're already there.
        aria-label="Decrease" // Spoken name, because "−" on its own isn't clear to a screen reader.
      >
        −
      </button>

      {/* The current number. aria-live="polite" makes screen readers announce it when it changes.
          min-w-8 = at least 32px wide, so the layout doesn't jump between 9 and 10. */}
      <span aria-live="polite" className="min-w-8 text-center font-body text-2xl font-semibold text-text">
        {value}
      </span>

      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(value + 1)} // Ask the parent to set the number one higher.
        disabled={value >= max} // Can't go above the maximum.
        aria-label="Increase"
      >
        +
      </button>
    </div>
  )
}

export default QuantityStepper // Lets the artwork and event pages load this component.
