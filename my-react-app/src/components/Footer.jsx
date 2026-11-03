import { allNavLinks } from '../data/navLinks.js'

// The footer is the #contact target, so it omits the Contact link and header-only subscription links.
const footerLinks = allNavLinks.filter((link) => link.href !== '#contact' && !link.whenSubscribed)

export default function Footer() {
  return (
    <footer id="contact">
      <div className="grid grid-cols-1 items-start gap-8 px-5 py-8 text-center sm:grid-cols-2 sm:gap-6 sm:px-10 md:grid-cols-[2fr_1fr_1fr] md:px-20 md:text-left">
        <div className="min-w-0">
          <p className="text-[2rem] font-semibold text-text">
            Aurora<span className="text-muted">Photography.</span>
          </p>
          <p className="mx-auto mt-6 max-w-[300px] font-body text-base text-accent md:mx-0">Capturing Beauty, Telling Stories.</p>
        </div>

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

        <div className="min-w-0">
          <h3 className="mb-4 text-[2rem] text-muted">Say Hello.</h3>
          <p className="mb-2 font-body text-base text-accent">
            <a href="mailto:sam@bluvibe.co.za" className="transition-colors hover:text-muted">Email Me</a>
            {/* Shown as text too, for devices without a configured mail client. */}
            <span className="mt-1 block text-sm text-muted select-all">sam@bluvibe.co.za</span>
          </p>
          <p className="mb-2 font-body text-base text-accent">Durban, South Africa</p>
        </div>
      </div>

      <p className="my-8 px-4 text-center text-base text-accent sm:my-12">&copy; 2026 Aurora Photography. Built by Sam Collins.</p>
    </footer>
  )
}
