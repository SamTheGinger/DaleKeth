// Primary navigation. Hash links without a slash scroll to a home-page section.
//   children         renders as a dropdown in the header
//   whenSubscribed   replacement link shown in the header once the user is subscribed (omitted from the footer)
const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  {
    label: 'View',
    children: [
      { href: '#portfolio', label: 'Portfolio' },
      { href: '#shop', label: 'Shop' },
      { href: '#events', label: 'Events' },
      { href: '#book', label: 'Book' },
      { href: '#subscribe', label: 'Subscribe', whenSubscribed: { href: '#/subscription', label: 'Subscribed' } },
    ],
  },
  { href: '#contact', label: 'Contact' },
]

// Flattened, without dropdown grouping (used by the footer).
export const allNavLinks = navLinks.flatMap((link) => link.children ?? [link])

export default navLinks
