# Aurora Photography

A responsive, dark-themed one-page portfolio for a portrait and landscape photographer.
Built for the **Mayerfeld Frontend Developer Practicum** (Week 1: static HTML/CSS landing page).

## Features

- Sticky header with a hamburger menu on screens ≤ 900px (works with keyboard and screen readers)
- Full-width hero banner with a dark overlay
- 12-photo portfolio grid: 3 columns on desktop, 2 on tablet, 1 on phone
- About section and a photoshoot booking form
- Smooth scrolling between sections
- No frameworks or build step: plain HTML, CSS and JavaScript

## Project structure

```
├── index.html            Page content (header, hero, portfolio, about, booking form, footer)
├── styles.css            All styling, design tokens and responsive breakpoints
├── nav.js                Opens/closes the mobile menu
├── CODE-WALKTHROUGH.md   Beginner, line-by-line explanation of the code
└── Images/Portraits/D3/  Portfolio photos, hero image (Header-Image.png) and Aurora.png
```

## Run it locally

Open `index.html` in a browser, or use a local server:

- **VS Code:** install the *Live Server* extension, then right-click `index.html` → *Open with Live Server*
- **Python:** `python3 -m http.server 8000`, then visit http://localhost:8000

## Customising

| To change… | Edit |
|---|---|
| Colours, fonts, spacing | The variables in `:root` at the top of `styles.css` |
| Hero image | The `url(...)` in `.hero` in `styles.css` |
| Portfolio photos | Add or remove `<article class="product-card">` blocks in `index.html` |
| Columns per row | `grid-template-columns` in `.product-grid` (and in each media query) |

## Fonts

[Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (headings) and [Inter](https://fonts.google.com/specimen/Inter) (body), loaded from Google Fonts.

## Next steps

- Connect the booking form to a service (for example Formspree or Netlify Forms). It doesn't send anywhere yet.
- Move the landscape shots (10–12) into their own folder, such as `Images/Landscapes/`.

## Credits

© 2026 Aurora Photography. Built by Sam Collins.
