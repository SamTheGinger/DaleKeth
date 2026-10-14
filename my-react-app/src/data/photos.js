// Every photo in the portfolio grid on the home page.
// This file is just a list of information. It shows nothing on screen by itself;
// the Portfolio and GalleryPage components read it and turn it into cards and pages.
//
// Each item in the list is an "object": a group of named values inside { }.
//   id       a unique number for the photo. The page link uses it (#/gallery/1).
//   title    the name shown on the card.
//   category 'Portrait' or 'Landscape'. The filter buttons use this.
//   src      the cover image shown on the card. Paths start with / because the
//            images live in the public/ folder, which is served from the site root.
//   gallery  the series of images shown when the card is clicked.
//            To add an image to a series, put the file in public/Images/ and add its path here.
//            (For now these reuse the existing photos as placeholders.)
const photos = [ // "const" makes a named box called photos; [ ] starts a list (an "array").
  {
    id: 1,
    title: 'Copper',
    category: 'Portrait',
    src: '/Images/Portraits/D3/1.png',
    gallery: ['/Images/Portraits/D3/1.png', '/Images/Portraits/D3/2.png', '/Images/Portraits/D3/3.png', '/Images/Portraits/D3/4.png'],
  }, // Each object ends with }, and the comma separates it from the next one.
  {
    id: 2,
    title: 'Ivory',
    category: 'Portrait',
    src: '/Images/Portraits/D3/2.png',
    gallery: ['/Images/Portraits/D3/2.png', '/Images/Portraits/D3/3.png', '/Images/Portraits/D3/4.png', '/Images/Portraits/D3/5.png'],
  },
  {
    id: 3,
    title: 'Ebony',
    category: 'Portrait',
    src: '/Images/Portraits/D3/3.png',
    gallery: ['/Images/Portraits/D3/3.png', '/Images/Portraits/D3/4.png', '/Images/Portraits/D3/5.png', '/Images/Portraits/D3/6.png'],
  },
  {
    id: 4,
    title: 'Strength',
    category: 'Portrait',
    src: '/Images/Portraits/D3/4.png',
    gallery: ['/Images/Portraits/D3/4.png', '/Images/Portraits/D3/5.png', '/Images/Portraits/D3/6.png', '/Images/Portraits/D3/7.png'],
  },
  {
    id: 5,
    title: 'Vigor',
    category: 'Portrait',
    src: '/Images/Portraits/D3/5.png',
    gallery: ['/Images/Portraits/D3/5.png', '/Images/Portraits/D3/6.png', '/Images/Portraits/D3/7.png', '/Images/Portraits/D3/8.png'],
  },
  {
    id: 6,
    title: 'Brawn',
    category: 'Portrait',
    src: '/Images/Portraits/D3/6.png',
    gallery: ['/Images/Portraits/D3/6.png', '/Images/Portraits/D3/7.png', '/Images/Portraits/D3/8.png', '/Images/Portraits/D3/9.png'],
  },
  {
    id: 7,
    title: 'Flesh',
    category: 'Portrait',
    src: '/Images/Portraits/D3/7.png',
    gallery: ['/Images/Portraits/D3/7.png', '/Images/Portraits/D3/8.png', '/Images/Portraits/D3/9.png', '/Images/Portraits/D3/1.png'],
  },
  {
    id: 8,
    title: 'Fashion',
    category: 'Portrait',
    src: '/Images/Portraits/D3/8.png',
    gallery: ['/Images/Portraits/D3/8.png', '/Images/Portraits/D3/9.png', '/Images/Portraits/D3/1.png', '/Images/Portraits/D3/2.png'],
  },
  {
    id: 9,
    title: 'Bronze',
    category: 'Portrait',
    src: '/Images/Portraits/D3/9.png',
    gallery: ['/Images/Portraits/D3/9.png', '/Images/Portraits/D3/1.png', '/Images/Portraits/D3/2.png', '/Images/Portraits/D3/3.png'],
  },
  {
    id: 10,
    title: 'Tranquility',
    category: 'Landscape',
    src: '/Images/Portraits/D3/10.png',
    gallery: ['/Images/Portraits/D3/10.png', '/Images/Portraits/D3/11.png', '/Images/Portraits/D3/12.png'],
  },
  {
    id: 11,
    title: 'Serenity',
    category: 'Landscape',
    src: '/Images/Portraits/D3/11.png',
    gallery: ['/Images/Portraits/D3/11.png', '/Images/Portraits/D3/12.png', '/Images/Portraits/D3/10.png'],
  },
  {
    id: 12,
    title: 'Peace',
    category: 'Landscape',
    src: '/Images/Portraits/D3/12.png',
    gallery: ['/Images/Portraits/D3/12.png', '/Images/Portraits/D3/10.png', '/Images/Portraits/D3/11.png'],
  },
] // ] closes the list.

export default photos // Lets other files load this list with: import photos from '../data/photos.js'
