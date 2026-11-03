export default function NotFoundPage() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-4xl text-text sm:text-5xl">
        Page <span className="text-muted">Not Found.</span>
      </h1>
      <p className="mt-4 font-body text-text">We couldn&rsquo;t find that page.</p>
      <a href="#hero" className="mt-6 font-body font-semibold text-accent transition-colors hover:text-muted">
        &larr; Back to home
      </a>
    </section>
  )
}
