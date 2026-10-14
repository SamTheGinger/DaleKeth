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
    src: '/Images/Copper/C1.png',
    gallery: ['/Images/Copper/C1.png', '/Images/Copper/C2.png', '/Images/Copper/C3.png', '/Images/Copper/C4.png', '/Images/Copper/C5.png', 'Images/Copper/C6.png', 'Images/Copper/C7.png', 'Images/Copper/C8.png', 'Images/Copper/C9.png'],
  }, // Each object ends with }, and the comma separates it from the next one.
  {
    id: 2,
    title: 'Sheathed',
    category: 'Portrait',
    src: '/Images/Sheathed/M1.png',
    gallery: ['/Images/Sheathed/M1.png', '/Images/Sheathed/M2.png', '/Images/Sheathed/M3.png', '/Images/Sheathed/M4.png','/Images/Sheathed/M5.png', '/Images/Sheathed/M6.png', '/Images/Sheathed/M7.png', '/Images/Sheathed/M8.png', '/Images/Sheathed/M9.png'],
  },
  {
    id: 3,
    title: 'Ebony',
    category: 'Portrait',
    src: '/Images/Ebony/E1.png',
    gallery: ['/Images/Ebony/E1.png', '/Images/Ebony/E2.png', '/Images/Ebony/E3.png', '/Images/Ebony/E4.png', '/Images/Ebony/E5.png', '/Images/Ebony/E6.png', '/Images/Ebony/E7.png', '/Images/Ebony/E8.png', '/Images/Ebony/E9.png'],
  },

  {
    id: 4,
    title: 'Strength',
    category: 'Portrait',
    src: '/Images/Strength/ST1.png',
    gallery: ['/Images/Strength/ST1.png', '/Images/Strength/ST2.png', '/Images/Strength/ST3.png', '/Images/Strength/ST4.png', '/Images/Strength/ST5.png', '/Images/Strength/ST6.png', '/Images/Strength/ST7.png', '/Images/Strength/ST8.png', '/Images/Strength/ST9.png'],
  },
  {
    id: 5,
    title: 'Vigor',
    category: 'Portrait',
    src: '/Images/Vigor/V1.png',
    gallery: ['/Images/Vigor/V1.png', '/Images/Vigor/V2.png', '/Images/Vigor/V3.png', '/Images/Vigor/V4.png', '/Images/Vigor/V5.png', '/Images/Vigor/V6.png', '/Images/Vigor/V7.png', '/Images/Vigor/V8.png', '/Images/Vigor/V9.png'],
  },
  {
    id: 6,
    title: 'Brawn',
    category: 'Portrait',
    src: '/Images/Brawn/BR1.png',
    gallery: ['/Images/Brawn/BR1.png', '/Images/Brawn/BR2.png', '/Images/Brawn/BR3.png', '/Images/Brawn/BR4.png', '/Images/Brawn/BR5.png', '/Images/Brawn/BR6.png', '/Images/Brawn/BR7.png', '/Images/Brawn/BR8.png', '/Images/Brawn/BR9.png'],
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
