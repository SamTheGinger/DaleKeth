import events from '../data/events.js' // The list of upcoming events.
import EventCard from './EventCard.jsx' // The card used for each event.

// The Events section on the home page: upcoming live installations and exhibitions.
// To add an event, add it to data/events.js. Nothing here needs changing.
function Events() {
  return (
    // id="events" is where the menu's "Events" link (#events) jumps to.
    <section id="events" className="mx-auto mb-12 w-full max-w-275 px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="mb-3 text-center text-2xl text-text sm:text-3xl md:text-4xl">
        Upcoming <span className="text-muted">Events.</span>
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-center font-body text-text sm:mb-10">
        Live art installations, exhibitions and workshops. Spots are limited, so book yours early.
      </p>

      {/* The events are stacked one under another. flex-col = top to bottom, gap-6 = space between them. */}
      <div className="flex flex-col gap-6 sm:gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} /> // One card per event; key = unique id React needs for lists.
        ))}
      </div>
    </section>
  )
}

export default Events // Lets HomePage.jsx load this with: import Events from '../components/Events.jsx'
