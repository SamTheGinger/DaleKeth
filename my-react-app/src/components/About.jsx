export default function About() {
  return (
    <section
      id="about"
      className="mx-auto flex w-full max-w-275 flex-col items-center gap-6 px-4 py-8 text-center sm:gap-10 sm:px-6 sm:py-12 md:flex-row md:gap-12.5"
    >
      <div className="w-full min-w-0 md:flex-[1_1_60%]">
        <h2 className="mb-2.5 text-2xl text-text sm:text-3xl md:text-4xl">
          The Woman <span className="text-muted">Behind The Art</span>
        </h2>
        <p className="font-body text-base text-text sm:px-8 sm:text-lg md:px-20">
          Aurora captures the beauty found in both people and places, creating striking portraits and timeless
          art. From expressive models and the quiet wonder of everyday surroundings to the beauty captured through charcoal and canvas, every photograph and art piece tells a story through light, emotion, and perspective.
        </p>
      </div>

      <div className="mx-auto w-full max-w-105 min-w-0 transition-transform duration-200 hover:-translate-y-2 md:max-w-85 md:flex-[0_1_30%]">
        <img
          loading="lazy"
          decoding="async"
          src="/Images/Portraits/D3/Aurora.webp"
          alt="Aurora, the photographer"
          className="w-full rounded-[14px] border-2 border-accent sm:rounded-[20px]"
        />
      </div>
    </section>
  )
}
