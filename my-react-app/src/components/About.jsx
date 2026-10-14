// "The Woman Behind The Lens" section on the home page.
// Mobile-first: on phones the text sits above the photo (flex-col).
// From 900px (md:flex-row) they sit side by side, text on the left, photo on the right.
function About() {
  return (
    // id="about" is what the menu's "About" link (#about) jumps to.
    // items-center = centred across, gap-* = space between text and photo (bigger on bigger screens).
    <section
      id="about"
      className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-6 px-4 py-8 text-center sm:gap-10 sm:px-6 sm:py-12 md:flex-row md:gap-[50px]"
    >
      {/* The text. md:flex-[1_1_60%] = on desktop it takes about 60% of the width and can grow or shrink. */}
      <div className="w-full min-w-0 md:flex-[1_1_60%]">
        <h2 className="mb-2.5 text-2xl text-text sm:text-3xl md:text-4xl">
          The Woman <span className="text-muted">Behind The Lens</span>
        </h2>
        {/* sm:px-8 / md:px-20 = extra space at the sides so the lines aren't too long to read comfortably. */}
        <p className="font-body text-base text-text sm:px-8 sm:text-lg md:px-20">
          Aurora captures the beauty found in both people and places, creating striking portraits and timeless
          landscape imagery. From expressive models to the quiet wonder of everyday surroundings, every photograph
          tells a story through light, emotion, and perspective.
        </p>
      </div>

      {/* The photo. max-w-[420px] on phones/tablets, max-w-[340px] and about 30% of the width on desktop.
          hover:-translate-y-2 = lifts slightly when the mouse is over it. */}
      <div className="mx-auto w-full max-w-[420px] min-w-0 transition-transform duration-200 hover:-translate-y-2 md:max-w-[340px] md:flex-[0_1_30%]">
        <img
          src="/Images/Portraits/D3/Aurora.png"
          alt="Aurora, the photographer"
          className="w-full rounded-[14px] border-2 border-accent sm:rounded-[20px]" // Rounded corners, slightly rounder from 640px.
        />
      </div>
    </section>
  )
}

export default About // Lets HomePage.jsx load this with: import About from '../components/About.jsx'
