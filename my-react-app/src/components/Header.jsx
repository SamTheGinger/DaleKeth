import { useEffect, useRef, useState } from 'react' // useState remembers if the menu is open; useEffect sets up listeners; useRef points at the header.
import navLinks from '../data/navLinks.js' // The list of menu links.
import { authClient } from '../utils/authClient.js' // Tells us who (if anyone) is signed in.

// The sticky top bar, shown on every page.
// On screens narrower than 900px the links fold away behind a "hamburger" button (☰).
// From 900px up (md:) the links sit in a row and the button is hidden.
// The last item is "Sign In" for visitors, or "Sign Out" once someone is signed in.
function Header() {
  const { data: session, isPending } = authClient.useSession() // session is null when nobody is signed in.
  const headerRef = useRef(null) // Gives us the real <header> element so we can measure it.

  // The header's height changes with the screen width (and whether the links fit on one row beside the logo).
  // Whenever it changes, tell the browser to leave exactly that much room (plus a little) above a section
  // when a menu link scrolls to it, so the sticky header never covers the section's heading.
  // (index.css has a fixed fallback for the first moment before this runs.)
  useEffect(() => {
    const header = headerRef.current
    const observer = new ResizeObserver(() => {
      document.documentElement.style.scrollPaddingTop = `${header.offsetHeight + 16}px`
    })
    observer.observe(header) // ResizeObserver calls the function above now, and every time the header's size changes.
    return () => observer.disconnect()
  }, [])
  // isMenuOpen = true when the phone menu is showing. It starts closed (false).
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // useEffect runs after React has drawn the header. The [] at the end means "only once".
  useEffect(() => {
    // Pressing the Escape key closes the menu.
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    // matchMedia watches the screen width. 56.25rem = 900px (the same as Tailwind's md:).
    // If the window is made wide enough for the desktop menu, reset the phone menu to closed.
    const desktop = window.matchMedia('(width >= 56.25rem)')
    function handleWidthChange(event) {
      if (event.matches) setIsMenuOpen(false) // event.matches is true when the window is now 900px or wider.
    }

    document.addEventListener('keydown', handleKeyDown) // Listen for key presses anywhere on the page.
    desktop.addEventListener('change', handleWidthChange) // Listen for the window crossing 900px.
    return () => {
      // Clean-up: stop listening if the header is ever removed from the page.
      document.removeEventListener('keydown', handleKeyDown)
      desktop.removeEventListener('change', handleWidthChange)
    }
  }, [])

  // Classes shared by the three lines of the hamburger icon:
  // block = shows as its own box, h-0.5 = 2px tall, w-full = full width of the button,
  // rounded-sm = slightly rounded ends, bg-accent = gold, transition = animates smoothly when it changes.
  const barClasses = 'block h-0.5 w-full rounded-sm bg-accent transition duration-200'

  // The Sign In link and Sign Out button look the same: a small gold outline "pill".
  // w-full on phones (an easy-to-tap row), md:w-auto = only as wide as its text on desktop.
  const authClasses =
    'my-3 inline-block w-full cursor-pointer rounded-full border-2 border-accent px-4 py-1.5 text-center font-body text-base leading-tight font-semibold whitespace-nowrap text-accent transition-colors hover:bg-accent/15 md:my-0 md:w-auto lg:text-lg'

  async function handleSignOut() {
    setIsMenuOpen(false)
    await authClient.signOut() // Deletes the session on the server and clears the cookie. useSession() then updates the whole site.
    window.location.hash = '#hero'
  }

  return (
    // sticky + top-0 = the header stays stuck to the top of the screen while you scroll.
    // z-10 = it sits on top of the page content. border-b-2 border-muted = a grey line underneath.
    <header ref={headerRef} className="sticky top-0 z-10 border-b-2 border-muted bg-background">
      {/* <nav> marks this as the main menu.
          relative = the phone menu (absolute, below) is positioned against this box.
          flex + items-center + justify-between = logo on the left, button/links on the right, vertically centred.
          flex-wrap = on desktop, if the links don't fit next to the logo they move to a second row. */}
      <nav className="relative mx-auto flex max-w-275 flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* The logo links back to the top of the home page. Text size: text-2xl on phones, sm:text-4xl from 640px, then a little smaller from 900px (md:) so all 7 links fit beside it, and back up to 2.8rem from 1280px (xl:).
            min-w-0 + <wbr /> = on very narrow screens (or with large text turned on) the logo can break onto two lines
            between "Aurora" and "Photography." instead of sticking out past the edge of the screen. */}
        <a href="#hero" className="min-w-0 text-2xl leading-tight font-semibold text-text sm:text-4xl md:text-[2rem] lg:text-4xl xl:text-[2.8rem]">
          Aurora<wbr />
          <span className="text-muted">Photography.</span>
        </a>

        {/* The hamburger button. md:hidden = hidden from 900px up, where the links are always visible.
            size-11 = 44 × 44px, shrink-0 = never squashed by a long logo, flex-col + justify-between = the three lines are spread evenly top to bottom. */}
        <button
          type="button"
          className="flex size-11 shrink-0 cursor-pointer flex-col justify-between rounded-lg border-2 border-accent px-2.5 py-3 transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text md:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} // What a screen reader says.
          aria-expanded={isMenuOpen} // Tells screen readers whether the menu is open.
          aria-controls="primary-navigation" // Names the menu (by its id) that this button opens.
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Flip open ↔ closed.
        >
          {/* When the menu is open, the top line moves down and turns 45°, the middle line fades out,
              and the bottom line moves up and turns -45°, which turns ☰ into ✕. */}
          <span className={`${barClasses} ${isMenuOpen ? 'translate-y-1.75 rotate-45' : ''}`} />
          <span className={`${barClasses} ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`${barClasses} ${isMenuOpen ? '-translate-y-1.75 -rotate-45' : ''}`} />
        </button>

        {/* The list of links.
            Phones (no prefix): hidden unless the menu is open; when open it's a drop-down panel (absolute, top-full = just
            below the header, inset-x-0 = full width) with links stacked top to bottom (flex-col).
            From 900px (md:): always shown (md:flex), back in the normal layout (md:static), links in a row (md:flex-row). */}
        <ul
          id="primary-navigation"
          className={`${isMenuOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col border-b-2 border-muted bg-background px-4 shadow-[0_12px_24px_rgba(0,0,0,0.45)] sm:px-6 md:static md:flex md:flex-row md:flex-wrap md:justify-center md:gap-5 md:border-0 md:p-0 md:shadow-none lg:gap-8`}
        >
          {/* One <li> per link in navLinks. key = unique value React needs for lists. */}
          {navLinks.map((link) => (
            // border-t = a faint line between links on phones; first:border-t-0 = no line above the first one;
            // md:border-0 = no lines on desktop.
            <li key={link.href} className="border-t border-muted/25 first:border-t-0 md:border-0">
              <a
                href={link.href}
                onClick={() => setIsMenuOpen(false)} // Picking a link closes the phone menu.
                // block + py-3.5 = big tap area on phones; whitespace-nowrap = the label never breaks onto two lines;
                // hover:text-muted = turns grey when hovered; md:text-base / lg:text-lg = text size on bigger screens.
                className="block py-3.5 text-center font-body text-base leading-tight font-semibold whitespace-nowrap text-accent transition-colors hover:text-muted md:inline-block md:py-1 lg:text-lg"
              >
                {link.label}
              </a>
            </li>
          ))}

          {/* Sign In / Sign Out. Nothing is shown for the split second while we check (isPending), so it doesn't flicker. */}
          {!isPending && (
            <li className="border-t border-muted/25 md:border-0">
              {session ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  title={`Signed in as ${session.user.email}`} // Shown when you hover over the button.
                  aria-label={`Sign out (signed in as ${session.user.email})`}
                  className={authClasses}
                >
                  Sign Out
                </button>
              ) : (
                <a href="#/signin" onClick={() => setIsMenuOpen(false)} className={authClasses}>
                  Sign In
                </a>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header // Lets App.jsx load this with: import Header from './components/Header.jsx'
