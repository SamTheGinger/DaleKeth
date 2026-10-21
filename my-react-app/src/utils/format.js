// Small helper functions that turn raw data into nicely written text.
// They're in their own file so every component that needs them can share them.

// Intl.NumberFormat is built into every browser. This one is set up for South African rand.
// 'en-ZA' = English as written in South Africa, currency: 'ZAR' = rand,
// maximumFractionDigits: 0 = no cents. Making it once here is faster than making it every time.
const randFormatter = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })

// Turns a number like 2400 into the text "R 2 400".
export function formatPrice(amount) {
  return randFormatter.format(amount) // .format() does the actual conversion.
}

// Turns a date written as '2026-11-21' into "Saturday, 21 November 2026".
export function formatDate(isoDate) {
  // new Date('2026-11-21') makes a date the browser understands (at midnight, UTC time).
  // timeZone: 'UTC' makes sure the day doesn't slip to the 20th for visitors in other time zones.
  return new Date(isoDate).toLocaleDateString('en-ZA', {
    weekday: 'long', // "Saturday"
    day: 'numeric', // "21"
    month: 'long', // "November"
    year: 'numeric', // "2026"
    timeZone: 'UTC',
  })
}
