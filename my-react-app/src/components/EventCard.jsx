import { formatDate, formatPrice } from '../utils/format.js'

export default function EventCard({ event }) {
  const isFree = event.price === 0

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border-2 border-accent bg-surface sm:flex-row">
      <img loading="lazy" decoding="async" src={event.src} alt="" className="aspect-video w-full object-cover sm:aspect-auto sm:w-2/5" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-body text-sm font-semibold tracking-wider text-accent uppercase">
          <time dateTime={event.date}>{formatDate(event.date)}</time> · {event.time}
        </p>
        <h3 className="mt-2 text-2xl leading-tight text-text sm:text-3xl">{event.title}</h3>
        <p className="mt-1 font-body text-sm text-muted">{event.venue}</p>
        <p className="mt-3 font-body text-text">{event.description}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
          <p className="font-body text-text">
            <span className="font-semibold text-accent">{isFree ? 'Free' : formatPrice(event.price)}</span>
            {!isFree && ' per spot'}
            <span className="text-muted"> · {event.spots} spots left</span>
          </p>
          <a
            href={`#/event/${event.id}`}
            className="rounded-full bg-accent px-6 py-2.5 font-body font-semibold text-background transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            {isFree ? 'Reserve a Spot' : 'Buy Spots'}
          </a>
        </div>
      </div>
    </article>
  )
}
