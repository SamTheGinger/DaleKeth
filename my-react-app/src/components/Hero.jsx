export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-105 flex-col items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/Images/Portraits/D3/Header-Image.webp')] bg-cover bg-center bg-no-repeat px-4 py-8 text-center text-text min-[400px]:min-h-120 sm:min-h-150 sm:px-5 md:py-16"
    >
      <p className="mt-4 mb-4 font-body text-lg font-semibold tracking-[0.1rem] text-accent uppercase sm:mt-10 sm:tracking-[0.15rem] md:mt-20">
        Photographer | Charcoal Artist
      </p>
      <h1 className="mb-4 w-full max-w-275 text-[2rem] leading-tight min-[400px]:text-4xl sm:text-5xl md:text-6xl">
        Capturing <span className="text-muted">Beauty.</span>
      </h1>
    </section>
  )
}
