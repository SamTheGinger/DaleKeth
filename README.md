# Aurora Photography

A responsive, dark-themed portfolio, art shop and event-booking site for a portrait and landscape photographer.
Started for the **Mayerfeld Frontend Developer Practicum** as a static HTML/CSS landing page, and now rebuilt with **React 19**, **Vite** and **Tailwind CSS 4**.

## What's new since the last README update

- **Rebuilt in React + Tailwind.** The old `index.html`, `styles.css` and `nav.js` were replaced by a Vite React app in `my-react-app/`. The original colours, fonts and 900px breakpoint were carried over as Tailwind theme tokens.
- **Multiple pages** using a small hash router (`#/gallery/3`, `#/artwork/1`, `#/event/2`), with working Back/Forward buttons and a "Page Not Found" page.
- **Portfolio filters:** All, Portrait, Landscape and Favourites. Each photo card has a Favourite toggle.
- **Gallery pages:** clicking a portfolio card opens its full image series, and each image has a Like (heart) button. Favourites and likes are kept while moving between pages.
- **Shop:** six charcoal artworks with prices in rand (e.g. R 6 500), each with its own sale page, a quantity stepper (capped at the number available) and a purchase-request form.
- **Events:** three upcoming events with dates, venues and prices, each with a booking page for choosing how many spots.
- **New photos:** 12 photo series (9 portrait, 3 landscape) in WebP format, plus artwork and event images. Images and prices were updated in the gallery and shop.
- **Look and responsiveness:** minor design tweaks, and the layout was checked on phone, tablet and desktop.
- **Fixes:** a round of bug fixes across the header, hero, about, events and detail pages, and a fuller `.gitignore`.
- Beginner-friendly comments explaining each part of the code are in every file.

## Features

- Sticky header with a hamburger menu below 900px
- Full-width hero banner with a dark overlay
- About section ("The Woman Behind The Lens")
- Portfolio grid with filters and favourites, linking to likeable gallery pages
- Shop and Events sections with detail pages, quantity steppers and live price totals
- Photoshoot booking form
- Smooth scrolling between sections, even when coming from another page
- Mobile-first layout: 1 column on phones, 2 on tablets, 3 on desktop

## Project structure

```
my-react-app/
├── index.html                 Page shell that loads the React app
├── vite.config.js             Vite settings (React + Tailwind plugins)
├── public/Images/             All photos, grouped by series (Copper, Ebony, Charcoal-Art, Events, ...)
└── src/
    ├── main.jsx               Starts the app
    ├── App.jsx                Picks which page to show; holds favourites and likes
    ├── index.css              Tailwind import, colour/font tokens and base styles
    ├── components/            Header, Hero, About, Portfolio, Shop, Events, BookingForm, Footer and smaller cards/buttons
    ├── pages/                 HomePage, GalleryPage, ArtworkPage, EventPage, NotFoundPage
    ├── data/                  photos.js, artworks.js, events.js, navLinks.js (the site's content)
    └── utils/                 format.js (rand prices, dates) and useHashRoute.js (the router)
```

## Run it locally

You need [Node.js](https://nodejs.org/) installed.

```bash
cd my-react-app
npm install      # first time only
npm run dev      # start the development server, then open the link it prints
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Builds the finished site into `dist/` |
| `npm run preview` | Serves the built site to check it before publishing |
| `npm run lint` | Checks the code with Oxlint |

## Customising

| To change… | Edit |
|---|---|
| Colours, fonts, breakpoint | The `@theme` block in `src/index.css` |
| Portfolio photos and gallery series | `src/data/photos.js` (images go in `public/Images/`) |
| Artwork, prices and stock | `src/data/artworks.js` |
| Events, dates and spots | `src/data/events.js` |
| Menu links | `src/data/navLinks.js` |

## Fonts

[Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (headings) and [Inter](https://fonts.google.com/specimen/Inter) (body), loaded from Google Fonts.

## Next steps

- Connect the booking, purchase and event forms to a service (for example Formspree or Netlify Forms). They only show a thank-you message for now.
- Save favourites and likes (they reset when the page is refreshed).
- Update `CODE-WALKTHROUGH.md`, which still explains the old HTML/CSS version.

## Credits

© 2026 Aurora Photography. Built by Sam Collins.
