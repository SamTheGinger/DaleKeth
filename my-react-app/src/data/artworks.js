// Every artwork for sale in the Shop grid on the home page.
// Like photos.js, this is only information; the Shop and ArtworkPage components display it.
// To sell a new piece, put its image in public/Images/ and add a new { } object to the list.
//
//   id          a unique number. The page link uses it (#/artwork/1).
//   title       the artwork's name.
//   medium      what it is made of or printed on.
//   size        its size.
//   price       the price of ONE piece in rand, as a plain number (no "R", no spaces).
//   available   how many are left. The quantity stepper won't go higher than this.
//   src         the image path (placeholders for now: swap in photos of the real artwork).
//   description a sentence or two shown on the artwork's own page.
const artworks = [
  {
    id: 1,
    title: 'Innocence',
    medium: 'Charcoal',
    size: '75cm × 50 cm',
    price: 6500,
    available: 1,
    src: '/Images/Charcoal-Art/CH1.png',
    description: 'Soft Charcoal on Canvas',
  },
  {
    id: 2,
    title: 'Immersion',
    medium: 'Charcoal',
    size: '100 × 50 cm',
    price: 7250,
    available: 1,
    src: '/Images/Charcoal-Art/CH2.png',
    description: 'Soft Charcoal on Paper',
  },
  {
    id: 3,
    title: 'Suffocation',
    medium: 'Charcoal',
    size: '100 × 30 cm',
    price: 6800,
    available: 1,
    src: '/Images/Charcoal-Art/CH3.png',
    description: 'Soft Charcoal on Paper',
  },
  {
    id: 4,
    title: 'Defiance',
    medium: 'Charcoal',
    size: '100 × 40 cm',
    price: 7150,
    available: 1,
    src: '/Images/Charcoal-Art/CH4.png',
    description: 'Soft Charcoal on Canvas',
  },
  {
    id: 5,
    title: 'Deception',
    medium: 'Charcoal',
    size: '90 × 60 cm',
    price: 4500,
    available: 1,
    src: '/Images/Charcoal-Art/CH5.png',
    description: 'Soft Charcoal on Paper',
  },
  {
    id: 6,
    title: 'Mercy',
    medium: 'Charcoal',
    size: '100 × 40 cm',
    price: 6750,
    available: 1,
    src: '/Images/Charcoal-Art/CH6.png',
    description: 'Soft Charcoal on Paper',
  },
]

export default artworks // Lets other files load this list with: import artworks from '../data/artworks.js'
