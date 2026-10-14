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
    title: 'Copper Study',
    medium: 'Hand-finished print on cotton rag paper',
    size: '50 × 50 cm',
    price: 1950,
    available: 8,
    src: '/Images/Portraits/D3/1.png',
    description: 'A warm, close study in copper tones, printed with archival inks and signed by the artist.',
  },
  {
    id: 2,
    title: 'Ivory in Light',
    medium: 'Limited edition giclée print',
    size: '70 × 50 cm',
    price: 3800,
    available: 3,
    src: '/Images/Portraits/D3/2.png',
    description: 'One of a numbered edition of ten. Soft window light and quiet stillness.',
  },
  {
    id: 3,
    title: 'Golden Hour',
    medium: 'Archival pigment print',
    size: '60 × 40 cm',
    price: 2400,
    available: 10,
    src: '/Images/Portraits/D3/10.png',
    description: 'The last warm light of the day, captured and printed on heavyweight matte paper.',
  },
  {
    id: 4,
    title: 'Stillness',
    medium: 'Framed print, oak frame',
    size: '40 × 40 cm',
    price: 1600,
    available: 6,
    src: '/Images/Portraits/D3/11.png',
    description: 'A calm interior scene, ready to hang in a solid oak frame.',
  },
  {
    id: 5,
    title: 'Quiet Room',
    medium: 'Stretched canvas',
    size: '90 × 60 cm',
    price: 4500,
    available: 2,
    src: '/Images/Portraits/D3/12.png',
    description: 'A large statement piece on gallery-wrapped canvas.',
  },
  {
    id: 6,
    title: 'Bronze',
    medium: 'Hand-finished print on cotton rag paper',
    size: '50 × 70 cm',
    price: 2200,
    available: 5,
    src: '/Images/Portraits/D3/9.png',
    description: 'Strong contrast and deep bronze tones, signed and numbered on the back.',
  },
]

export default artworks // Lets other files load this list with: import artworks from '../data/artworks.js'
