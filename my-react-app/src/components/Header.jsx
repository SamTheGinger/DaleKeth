import { useEffect, useRef, useState } from 'react'
import navLinks from '../data/navLinks.js'
import { authClient } from '../utils/authClient.js'

const barClasses = 'block h-0.5 w-full rounded-sm bg-accent transition duration-200'
const authClasses =
  'my-3 inline-block w-full cursor-pointer rounded-full border-2 border-accent px-4 py-1.5 text-center font-body text-base leading-tight font-semibold whitespace-nowrap text-accent transition-colors hover:bg-accent/15 md:my-0 md:w-auto lg:text-lg'
const textClasses = 'font-body text-base leading-tight font-semibold whitespace-nowrap text-accent transition-colors hover:text-muted lg:text-lg'
const linkClasses = `${textClasses} block py-3.5 text-center md:inline-block md:py-1`
const viewButtonClasses = `${textClasses} flex w-full cursor-pointer items-center justify-center gap-1.5 py-3.5 md:w-auto md:py-1`
const viewLinkClasses = `${textClasses} block py-3 text-center md:px-5 md:py-2 md:hover:bg-accent/15`

// Sticky site header. Below the md breakpoint (900px) links collapse behind a menu button;
// the "View" item is a dropdown on desktop and an inline accordion on mobile.
export default function Header() {
  const { data: session, isPending } = authClient.useSession()
  const isSubscribed = Boolean(session?.user.marketingOptIn)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const headerRef = useRef(null)
  const viewRef = useRef(null)

  function closeMenus() {
    setIsMenuOpen(false)
    setIsViewOpen(false)
  }

  // Keep scroll-padding-top in sync with the header's real height so anchor targets aren't hidden beneath it.
  useEffect(() => {
    const header = headerRef.current
    const observer = new ResizeObserver(() => {
      document.documentElement.style.scrollPaddingTop = `${header.offsetHeight + 16}px`
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // Close the View dropdown on outside click.
  useEffect(() => {
    if (!isViewOpen) return
    function handlePointerDown(event) {
      if (!viewRef.current.contains(event.target)) setIsViewOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isViewOpen])

  // Close menus on Escape, and reset the mobile menu when resizing up to desktop.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') closeMenus()
    }
    const desktop = window.matchMedia('(width >= 56.25rem)')
    function handleWidthChange(event) {
      if (event.matches) setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    desktop.addEventListener('change', handleWidthChange)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      desktop.removeEventListener('change', handleWidthChange)
    }
  }, [])

  async function handleSignOut() {
    closeMenus()
    await authClient.signOut()
    window.location.hash = '#hero'
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-10 border-b-2 border-muted bg-background">
      <nav className="relative mx-auto flex max-w-275 flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* <wbr> lets the logo wrap on very narrow screens instead of overflowing. */}
        <a href="#hero" className="min-w-0 text-2xl leading-tight font-semibold text-text sm:text-4xl md:text-[2rem] lg:text-4xl xl:text-[2.8rem]">
          Aurora<wbr />
          <span className="text-muted">Photography.</span>
        </a>

        <button
          type="button"
          className="flex size-11 shrink-0 cursor-pointer flex-col justify-between rounded-lg border-2 border-accent px-2.5 py-3 transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text md:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen)
            setIsViewOpen(false)
          }}
        >
          {/* Hamburger bars animate into an X when open. */}
          <span className={`${barClasses} ${isMenuOpen ? 'translate-y-1.75 rotate-45' : ''}`} />
          <span className={`${barClasses} ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`${barClasses} ${isMenuOpen ? '-translate-y-1.75 -rotate-45' : ''}`} />
        </button>

        <ul
          id="primary-navigation"
          className={`${isMenuOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col border-b-2 border-muted bg-background px-4 shadow-[0_12px_24px_rgba(0,0,0,0.45)] sm:px-6 md:static md:flex md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-5 md:border-0 md:p-0 md:shadow-none lg:gap-8`}
        >
          {navLinks.map((link) =>
            link.children ? (
              <li key={link.label} ref={viewRef} className="border-t border-muted/25 first:border-t-0 md:relative md:border-0">
                <button
                  type="button"
                  aria-expanded={isViewOpen}
                  aria-controls="view-menu"
                  onClick={() => setIsViewOpen(!isViewOpen)}
                  className={viewButtonClasses}
                >
                  {link.label}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-3.5 transition-transform duration-200 ${isViewOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M2.5 4.5 6 8l3.5-3.5" />
                  </svg>
                </button>

                <ul
                  id="view-menu"
                  className={`${isViewOpen ? 'block' : 'hidden'} mb-3 rounded-lg bg-surface md:absolute md:top-full md:left-1/2 md:z-20 md:mt-3 md:mb-0 md:min-w-44 md:-translate-x-1/2 md:border-2 md:border-accent md:bg-background md:py-2 md:shadow-[0_12px_24px_rgba(0,0,0,0.45)]`}
                >
                  {link.children.map((child) => {
                    const item = child.whenSubscribed && isSubscribed ? child.whenSubscribed : child
                    return (
                      <li key={child.href}>
                        <a href={item.href} onClick={closeMenus} className={viewLinkClasses}>
                          {item.label}
                          {item !== child && <span aria-hidden="true" className="ml-1.5">&#10003;</span>}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ) : (
              <li key={link.href} className="border-t border-muted/25 first:border-t-0 md:border-0">
                <a href={link.href} onClick={closeMenus} className={linkClasses}>
                  {link.label}
                </a>
              </li>
            ),
          )}

          {/* Hidden while the session loads to avoid a Sign In / Sign Out flicker. */}
          {!isPending && (
            <li className="border-t border-muted/25 md:border-0">
              {session ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  title={`Signed in as ${session.user.email}`}
                  aria-label={`Sign out (signed in as ${session.user.email})`}
                  className={authClasses}
                >
                  Sign Out
                </button>
              ) : (
                <a href="#/signin" onClick={closeMenus} className={authClasses}>
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
