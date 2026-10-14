// The big banner at the top of the home page.
function Hero() {
  return (
    // id="hero" is what the logo and "Home" link (#hero) jump to.
    // The background is two layers: a 60% black see-through layer (the linear-gradient) on top of the photo,
    // which darkens it so the text is easy to read. bg-cover = the photo fills the whole box,
    // bg-center = keep the middle of the photo in view, bg-no-repeat = don't tile it.
    // flex + flex-col + items-center + justify-center = the text is centred both ways.
    // Height grows with the screen: min-h-[420px] on small phones, 480px from 400px wide, 600px from 640px (sm:).
    <section
      id="hero"
      className="flex min-h-105 flex-col items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/Images/Portraits/D3/Header-Image.webp')] bg-cover bg-center bg-no-repeat px-4 py-8 text-center text-text min-[400px]:min-h-120 sm:min-h-150 sm:px-5 md:py-16"
    >
      {/* The small gold line above the heading. tracking-* = spacing between letters, uppercase = CAPITALS. */}
      <p className="mt-4 mb-4 font-body text-lg font-semibold tracking-[0.1rem] text-accent uppercase sm:mt-10 sm:tracking-[0.15rem] md:mt-20">
        Photographer | Charcoal Artist
      </p>
      {/* The main heading of the home page. Grows from 2rem on phones to text-6xl from 900px. */}
      <h1 className="mb-4 w-full max-w-275 text-[2rem] leading-tight min-[400px]:text-4xl sm:text-5xl md:text-6xl">
        Capturing <span className="text-muted">Beauty.</span>
      </h1>
    </section>
  )
}

export default Hero // Lets HomePage.jsx load this with: import Hero from '../components/Hero.jsx'
