const buttonClasses =
  'flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-accent font-body text-xl font-bold text-accent transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

// Controlled − n + input clamped to [min, max].
export default function QuantityStepper({ value, onChange, min = 1, max, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-3 min-[360px]:gap-4">
      <button type="button" className={buttonClasses} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease">
        −
      </button>

      <span aria-live="polite" className="min-w-8 text-center font-body text-2xl font-semibold text-text">
        {value}
      </span>

      <button type="button" className={buttonClasses} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase">
        +
      </button>
    </div>
  )
}
