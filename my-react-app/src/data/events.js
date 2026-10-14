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
    src: '/Images/Events/EV1.webp',
    description:
      'Watch art come alive before your eyes. Join us for a one-night live installation where artists turn paint, clay, light and more into masterpieces in real time, led by the mesmerizing Aurora, whose work you have to see being made to believe.',
  },
  {
    id: 2,
    title: 'Portraits in Motion',
    date: '2026-12-12',
    time: '14:00 – 17:00',
    venue: 'Lighthouse Studio, Umhlanga',
    price: 350,
    spots: 12,
    src: '/Images/Events/EV2.webp',
    description:
      'Step behind the lens and watch the magic happen. Join us for a live photoshoot experience where photographers turn light, styling and a few moments into stunning images in real time, led by the captivating Aurora, whose eye for the perfect shot you have to see in action.',
  },
  {
    id: 3,
    title: 'Aurora After Dark',
    date: '2027-02-06',
    time: '19:30 – 23:00',
    venue: 'Warehouse 9, Durban Point',
    price: 0,
    spots: 80,
    src: '/Images/Events/EV3.webp',
    description:
      'Wander through a world of color, light and imagination at our art gallery, where talented artists show off their finest pieces and most striking photography. Don’t miss the work of Aurora, whose pieces stop people in their tracks and stay with them long after they leave.',
  },
]

export default events // Lets other files load this list with: import events from '../data/events.js'
