import { formatDate, formatPrice } from '../utils/format.js' // Helpers for nicely written dates and prices.

// One upcoming event in the Events section, with a "Book a spot" button.
//
// Props (inputs from Events.jsx):
//   event  one object from data/events.js ({ id, title, date, time, venue, price, spots, src, description }).
function EventCard({ event }) {
  return (
    // <article> = a self-contained piece of content.
    // Mobile-first: on phones the image sits on top of the text (flex-col).
    // From 640px (sm:flex-row) the image moves to the left and the text sits beside it.
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border-2 border-accent bg-surface sm:flex-row">
      {/* aspect-video = a wide 16:9 image on phones. sm:aspect-auto + sm:w-2/5 = from 640px it's 40% of
          the card's width and as tall as the text beside it. */}
      {/* loading="lazy" = only download this image when it is about to scroll into view, so the page opens faster.
          decoding="async" = let the browser unpack the image in the background without freezing the page. */}
      <img loading="lazy" decoding="async" src={event.src} alt="" className="aspect-video w-full object-cover sm:aspect-auto sm:w-2/5" />
      {/* alt="" because the image is decoration: the title below already says what the event is. */}

      {/* The text side. flex-1 = takes up the rest of the width. */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* <time> marks this as a date. dateTime gives computers the exact date; people see the friendly version. */}
        <p className="font-body text-sm font-semibold tracking-wider text-accent uppercase">
          <time dateTime={event.date}>{formatDate(event.date)}</time> · {event.time}
        </p>
        <h3 className="mt-2 text-2xl leading-tight text-text sm:text-3xl">{event.title}</h3>
        <p className="mt-1 font-body text-sm text-muted">{event.venue}</p>
        <p className="mt-3 font-body text-text">{event.description}</p>

        {/* The bottom row: price and spots on the left, the button on the right.
            mt-auto = pushes this row to the bottom of the card. flex-wrap = wraps on narrow screens.
            justify-between = the two groups are pushed to opposite ends. */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
          <p className="font-body text-text">
            {/* If the price is 0, say "Free"; otherwise show the price. */}
            <span className="font-semibold text-accent">{event.price === 0 ? 'Free' : formatPrice(event.price)}</span>
            {event.price > 0 && ' per spot'} {/* Only add " per spot" when the event isn't free. */}
            <span className="text-muted"> · {event.spots} spots left</span>
          </p>
          {/* A link that looks like a button. It goes to #/event/1 (etc.), which App.jsx turns into the booking page. */}
          <a
            href={`#/event/${event.id}`}
            className="rounded-full bg-accent px-6 py-2.5 font-body font-semibold text-background transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            Book a Spot
          </a>
        </div>
      </div>
    </article>
  )
}

export default EventCard // Lets Events.jsx load this with: import EventCard from './EventCard.jsx'
