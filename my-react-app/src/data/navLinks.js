// The menu links. The Header shows all of them; the Footer shows all except Contact.
// Each href starting with # is the id of a section on the home page,
// so clicking it scrolls to that section (even from another page; see App.jsx).
const navLinks = [
  { href: '#hero', label: 'Home' }, // href = where the link goes, label = the text people see.
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#about', label: 'About' },
  { href: '#shop', label: 'Shop' },
  { href: '#events', label: 'Events' },
  { href: '#book', label: 'Book' },
  { href: '#contact', label: 'Contact' },
]

export default navLinks // Lets other files load this list with: import navLinks from '../data/navLinks.js'
