const randFormatter = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })

// 2400 -> "R 2 400"
export function formatPrice(amount) {
  return randFormatter.format(amount)
}

// '2026-11-21' -> "Saturday, 21 November 2026". Formatted in UTC so the day never shifts with the visitor's time zone.
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// 1 -> "1 spot", 3 -> "3 spots"
export function formatSpots(count) {
  return `${count} ${count === 1 ? 'spot' : 'spots'}`
}
