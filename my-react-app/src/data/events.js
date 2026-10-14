// Upcoming events, such as live art installations.
// The Events section and EventPage component read this list.
// To add an event, copy one of the { } objects below and change the values.
//
//   id          a unique number. The booking page link uses it (#/event/1).
//   title       the event's name.
//   date        the date written as YEAR-MONTH-DAY (e.g. '2026-11-21'). It's shown as
//               "Saturday, 21 November 2026" on the page. Writing it this way also lets
//               the browser and search engines understand it as a real date.
//   time        the start and end time, written the way you want it shown.
//   venue       where it is held.
//   price       the price of ONE spot in rand, as a plain number. Use 0 for a free event.
//   spots       how many spots are still open. The stepper won't let people book more.
//   src         the image for the event card (placeholders for now).
//   description a short paragraph about the event.
const events = [
  {
    id: 1,
    title: 'Light & Shadow: A Live Installation',
    date: '2026-11-21',
    time: '18:00 – 21:00',
    venue: 'The Glasshouse, Florida Road, Durban',
    price: 250,
    spots: 40,
    src: '/Images/Portraits/D3/10.png',
    description:
      'Walk through a room of suspended prints while Aurora lights and photographs the space live. Every guest leaves with a small signed print made on the night.',
  },
  {
    id: 2,
    title: 'Portraits in Motion',
    date: '2026-12-12',
    time: '14:00 – 17:00',
    venue: 'Lighthouse Studio, Umhlanga',
    price: 350,
    spots: 12,
    src: '/Images/Portraits/D3/5.png',
    description:
      'A small, hands-on afternoon. Watch a full portrait session from setup to final edit, then step in front of the camera yourself.',
  },
  {
    id: 3,
    title: 'Aurora After Dark',
    date: '2027-02-06',
    time: '19:30 – 23:00',
    venue: 'Warehouse 9, Durban Point',
    price: 0,
    spots: 80,
    src: '/Images/Portraits/D3/12.png',
    description:
      'An evening opening of new work, projected large across the warehouse walls, with music and a chance to meet the artist. Free entry, but spots must be booked.',
  },
]

export default events // Lets other files load this list with: import events from '../data/events.js'
