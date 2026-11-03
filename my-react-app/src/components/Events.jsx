import { useApi } from '../utils/api.js'
import LoadState from './LoadState.jsx'
import EventCard from './EventCard.jsx'

export default function Events() {
  const { data: events, error, isLoading } = useApi('/api/events')

  return (
    <section id="events" className="mx-auto mb-12 w-full max-w-275 px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="mb-3 text-center text-2xl text-text sm:text-3xl md:text-4xl">
        Upcoming <span className="text-muted">Events.</span>
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-center font-body text-text sm:mb-10">
        Live art installations, exhibitions and workshops. Spots are limited, so book yours early.
      </p>

      <LoadState isLoading={isLoading} error={error}>
        <div className="flex flex-col gap-6 sm:gap-8">
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </LoadState>
    </section>
  )
}
