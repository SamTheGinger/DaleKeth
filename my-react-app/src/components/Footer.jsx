import { allNavLinks } from '../data/navLinks.js' // Every menu link in one flat list (no View drop-down), shared with the Header.

// The footer at the bottom of every page.
// Mobile-first: one column on phones, two from 640px (sm:), three from 900px (md:, the brand column twice as wide).
function Footer() {
  // The footer IS the Contact section, so it doesn't need a link to itself.
  // .filter() keeps every link except the one whose href is '#contact'.
  const footerLinks = allNavLinks.filter((link) => link.href !== '#contact')

  return (
    // id="contact" is what the menu's "Contact" link (#contact) jumps to.
    <footer id="contact">
      {/* grid-cols-1 → sm:grid-cols-2 → md:grid-cols-[2fr_1fr_1fr] = 1, then 2, then 3 columns (first one twice as wide).
          text-center on phones/tablets, md:text-left on desktop. */}
      <div className="grid grid-cols-1 items-start gap-8 px-5 py-8 text-center sm:grid-cols-2 sm:gap-6 sm:px-10 md:grid-cols-[2fr_1fr_1fr] md:px-20 md:text-left">
        {/* Column 1: the logo and tagline. min-w-0 lets the column shrink instead of pushing the page wider. */}
        <div className="min-w-0">
          <p className="text-[2rem] font-semibold text-text">
            Aurora<span className="text-muted">Photography.</span>
          </p>
          <p className="mx-auto mt-6 max-w-[300px] font-body text-base text-accent md:mx-0">Capturing Beauty, Telling Stories.</p>
        </div>

        {/* Column 2: quick links. On phones/tablets they sit side by side (inline-block); on desktop, one per line (md:block). */}
        <div className="min-w-0">
          <h3 className="mb-4 text-[2rem] text-muted">Explore.</h3>
          <ul>
            {footerLinks.map((link) => (
              <li key={link.href} className="inline-block md:block">
                <a href={link.href} className="mx-2 mb-2 block font-body text-base text-accent transition-colors hover:text-muted md:mx-0">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: contact details. mailto: opens the visitor's email app. */}
        <div className="min-w-0">
          <h3 className="mb-4 text-[2rem] text-muted">Say Hello.</h3>
          <p className="mb-2 font-body text-base text-accent">
            {/* "Email Me" opens the visitor's email app with a new message to sam@bluvibe.co.za. */}
            <a href="mailto:sam@bluvibe.co.za" className="transition-colors hover:text-muted">Email Me</a>
            {/* The address itself in small grey text underneath, for anyone whose device has no email app set up:
                they can still read it or copy it. block = its own line; select-all = one tap/click selects the whole address. */}
            <span className="mt-1 block text-sm text-muted select-all">sam@bluvibe.co.za</span>
          </p>
          <p className="mb-2 font-body text-base text-accent">Durban, South Africa</p>
        </div>
      </div>

      {/* Copyright line. &copy; is the HTML code for the © symbol. */}
      <p className="my-8 px-4 text-center text-base text-accent sm:my-12">&copy; 2026 Aurora Photography. Built by Sam Collins.</p>
    </footer>
  )
}

export default Footer // Lets App.jsx load this with: import Footer from './components/Footer.jsx'
