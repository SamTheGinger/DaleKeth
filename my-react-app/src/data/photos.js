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
    src: '/Images/Copper/C1.webp',
    gallery: ['/Images/Copper/C1.webp', '/Images/Copper/C2.webp', '/Images/Copper/C3.webp', '/Images/Copper/C4.webp', '/Images/Copper/C5.webp', 'Images/Copper/C6.webp', 'Images/Copper/C7.webp', 'Images/Copper/C8.webp', 'Images/Copper/C9.webp'],
  }, // Each object ends with }, and the comma separates it from the next one.
  {
    id: 2,
    title: 'Sheathed',
    category: 'Portrait',
    src: '/Images/Sheathed/M1.webp',
    gallery: ['/Images/Sheathed/M1.webp', '/Images/Sheathed/M2.webp', '/Images/Sheathed/M3.webp', '/Images/Sheathed/M4.webp','/Images/Sheathed/M5.webp', '/Images/Sheathed/M6.webp', '/Images/Sheathed/M7.webp', '/Images/Sheathed/M8.webp', '/Images/Sheathed/M9.webp'],
  },
  {
    id: 3,
    title: 'Ebony',
    category: 'Portrait',
    src: '/Images/Ebony/E1.webp',
    gallery: ['/Images/Ebony/E1.webp', '/Images/Ebony/E2.webp', '/Images/Ebony/E3.webp', '/Images/Ebony/E4.webp', '/Images/Ebony/E5.webp', '/Images/Ebony/E6.webp', '/Images/Ebony/E7.webp', '/Images/Ebony/E8.webp', '/Images/Ebony/E9.webp'],
  },

  {
    id: 4,
    title: 'Strength',
    category: 'Portrait',
    src: '/Images/Strength/ST1.webp',
    gallery: ['/Images/Strength/ST1.webp', '/Images/Strength/ST2.webp', '/Images/Strength/ST3.webp', '/Images/Strength/ST4.webp', '/Images/Strength/ST5.webp', '/Images/Strength/ST6.webp', '/Images/Strength/ST7.webp', '/Images/Strength/ST8.webp', '/Images/Strength/ST9.webp'],
  },
  {
    id: 5,
    title: 'Vigor',
    category: 'Portrait',
    src: '/Images/Vigor/V1.webp',
    gallery: ['/Images/Vigor/V1.webp', '/Images/Vigor/V2.webp', '/Images/Vigor/V3.webp', '/Images/Vigor/V4.webp', '/Images/Vigor/V5.webp', '/Images/Vigor/V6.webp', '/Images/Vigor/V7.webp', '/Images/Vigor/V8.webp', '/Images/Vigor/V9.webp'],
  },
  {
    id: 6,
    title: 'Brawn',
    category: 'Portrait',
    src: '/Images/Brawn/BR1.webp',
    gallery: ['/Images/Brawn/BR1.webp', '/Images/Brawn/BR2.webp', '/Images/Brawn/BR3.webp', '/Images/Brawn/BR4.webp', '/Images/Brawn/BR5.webp', '/Images/Brawn/BR6.webp', '/Images/Brawn/BR7.webp', '/Images/Brawn/BR8.webp', '/Images/Brawn/BR9.webp'],
  },
  {
    id: 7,
    title: 'Flesh',
    category: 'Portrait',
    src: '/Images/Flesh/F1.webp',
    gallery: ['/Images/Flesh/F1.webp', '/Images/Flesh/F2.webp', '/Images/Flesh/F3.webp', '/Images/Flesh/F4.webp', '/Images/Flesh/F5.webp', '/Images/Flesh/F6.webp', '/Images/Flesh/F7.webp', '/Images/Flesh/F8.webp', '/Images/Flesh/F9.webp'],
  },
  {
    id: 8,
    title: 'Fashion',
    category: 'Portrait',
    src: '/Images/Fashion/FA1.webp',
    gallery: ['/Images/Fashion/FA1.webp', '/Images/Fashion/FA2.webp', '/Images/Fashion/FA3.webp', '/Images/Fashion/FA4.webp', '/Images/Fashion/FA5.webp', '/Images/Fashion/FA6.webp', '/Images/Fashion/FA7.webp', '/Images/Fashion/FA8.webp', '/Images/Fashion/FA9.webp'],
  },
  {
    id: 9,
    title: 'Body Art',
    category: 'Portrait',
    src: '/Images/Body-Art/BA1.webp',
    gallery: ['/Images/Body-Art/BA1.webp', '/Images/Body-Art/BA2.webp', '/Images/Body-Art/BA3.webp', '/Images/Body-Art/BA4.webp', '/Images/Body-Art/BA5.webp', '/Images/Body-Art/BA6.webp', '/Images/Body-Art/BA7.webp', '/Images/Body-Art/BA8.webp', '/Images/Body-Art/BA9.webp',],
  },
  {
    id: 10,
    title: 'Serenity',
    category: 'Landscape',
    src: '/Images/Serenity/SE1.webp',
    gallery: ['/Images/Serenity/SE1.webp', '/Images/Serenity/SE2.webp', '/Images/Serenity/SE3.webp', '/Images/Serenity/SE4.webp', '/Images/Serenity/SE5.webp', '/Images/Serenity/SE6.webp', '/Images/Serenity/SE7.webp', '/Images/Serenity/SE8.webp', '/Images/Serenity/SE9.webp',],
  },
  {
    id: 11,
    title: 'Tranquility',
    category: 'Landscape',
    src: 'Images/Tranquility/T1.webp',
    gallery: ['Images/Tranquility/T1.webp', 'Images/Tranquility/T2.webp', 'Images/Tranquility/T3.webp', 'Images/Tranquility/T4.webp', 'Images/Tranquility/T5.webp', 'Images/Tranquility/T6.webp', 'Images/Tranquility/T7.webp', 'Images/Tranquility/T8.webp', 'Images/Tranquility/T9.webp']
  },
  {
    id: 12,
    title: 'Peace',
    category: 'Landscape',
    src: '/Images/Peace/P1.webp',
    gallery: ['/Images/Peace/P1.webp', '/Images/Peace/P2.webp', '/Images/Peace/P3.webp', '/Images/Peace/P4.webp', '/Images/Peace/P5.webp', '/Images/Peace/P6.webp', '/Images/Peace/P7.webp', '/Images/Peace/P8.webp', '/Images/Peace/P9.webp',],
  },
] // ] closes the list.

export default photos // Lets other files load this list with: import photos from '../data/photos.js'
