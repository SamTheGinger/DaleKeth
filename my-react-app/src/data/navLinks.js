// The menu links. The Header shows them in this order; an item with "children" becomes a drop-down
// menu (View ▾) holding those links. The Footer shows every link in one flat list, except Contact.
// whenSubscribed = a different label and address the Header uses once the signed-in person is subscribed to
// the emails (Subscribe -> Subscribed, which opens their "Your Subscription" page). The Footer leaves these links out.
// Each href starting with # is the id of a section on the home page,
// so clicking it scrolls to that section (even from another page; see App.jsx).
const navLinks = [
  { href: '#hero', label: 'Home' }, // href = where the link goes, label = the text people see.
  { href: '#about', label: 'About' },
  {
    label: 'View', // No href: this one opens a drop-down instead of going somewhere.
    children: [
      { href: '#portfolio', label: 'Portfolio' },
      { href: '#shop', label: 'Shop' },
      { href: '#events', label: 'Events' },
      { href: '#book', label: 'Book' },
      {
        href: '#subscribe', // The "Stay In The Loop" section, last on the home page.
        label: 'Subscribe',
        whenSubscribed: { href: '#/subscription', label: 'Subscribed' }, // Their subscription page instead.
      },
    ],
  },
  { href: '#contact', label: 'Contact' },
]

// The same links without the drop-down grouping: Home, About, Portfolio, Shop, Events, Book, Contact.
// .flatMap() replaces the View item with its children and keeps every other link as it is.
export const allNavLinks = navLinks.flatMap((link) => link.children ?? [link])

export default navLinks // Lets other files load this list with: import navLinks from '../data/navLinks.js'
