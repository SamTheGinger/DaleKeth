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
    src: '/Images/Flesh/F1.png',
    gallery: ['/Images/Flesh/F1.png', '/Images/Flesh/F2.png', '/Images/Flesh/F3.png', '/Images/Flesh/F4.png', '/Images/Flesh/F5.png', '/Images/Flesh/F6.png', '/Images/Flesh/F7.png', '/Images/Flesh/F8.png', '/Images/Flesh/F9.png'],
  },
  {
    id: 8,
    title: 'Fashion',
    category: 'Portrait',
    src: '/Images/Fashion/FA1.png',
    gallery: ['/Images/Fashion/FA1.png', '/Images/Fashion/FA2.png', '/Images/Fashion/FA3.png', '/Images/Fashion/FA4.png', '/Images/Fashion/FA5.png', '/Images/Fashion/FA6.png', '/Images/Fashion/FA7.png', '/Images/Fashion/FA8.png', '/Images/Fashion/FA9.png'],
  },
  {
    id: 9,
    title: 'Body Art',
    category: 'Portrait',
    src: '/Images/Body-Art/BA1.png',
    gallery: ['/Images/Body-Art/BA1.png', '/Images/Body-Art/BA2.png', '/Images/Body-Art/BA3.png', '/Images/Body-Art/BA4.png', '/Images/Body-Art/BA5.png', '/Images/Body-Art/BA6.png', '/Images/Body-Art/BA7.png', '/Images/Body-Art/BA8.png', '/Images/Body-Art/BA9.png',],
  },
  {
    id: 10,
    title: 'Serenity',
    category: 'Landscape',
    src: '/Images/Serenity/SE1.png',
    gallery: ['/Images/Serenity/SE1.png', '/Images/Serenity/SE2.png', '/Images/Serenity/SE3.png', '/Images/Serenity/SE4.png', '/Images/Serenity/SE5.png', '/Images/Serenity/SE6.png', '/Images/Serenity/SE7.png', '/Images/Serenity/SE8.png', '/Images/Serenity/SE9.png',],
  },
  {
    id: 11,
    title: 'Tranquility',
    category: 'Landscape',
    src: 'Images/Tranquility/T1.png',
    gallery: ['Images/Tranquility/T1.png', 'Images/Tranquility/T2.png', 'Images/Tranquility/T3.png', 'Images/Tranquility/T4.png', 'Images/Tranquility/T5.png', 'Images/Tranquility/T6.png', 'Images/Tranquility/T7.png', 'Images/Tranquility/T8.png', 'Images/Tranquility/T9.png']
  },
  {
    id: 12,
    title: 'Peace',
    category: 'Landscape',
    src: '/Images/Peace/P1.png',
    gallery: ['/Images/Peace/P1.png', '/Images/Peace/P2.png', '/Images/Peace/P3.png', '/Images/Peace/P4.png', '/Images/Peace/P5.png', '/Images/Peace/P6.png', '/Images/Peace/P7.png', '/Images/Peace/P8.png', '/Images/Peace/P9.png',],
  },
] // ] closes the list.

export default photos // Lets other files load this list with: import photos from '../data/photos.js'
