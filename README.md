# Aurora Photography
Website assignment for Mayerfeld Frontend Developer Practicum - photography or art protfolio.
## Status
Week 1 Statis HTML/CSS landing page

/*Index.html*/

Project: Portfolio / Personal site (inferred) Description: A responsive, dark-themed portfolio or personal landing page. Styles use CSS design tokens (variables) for color, spacing and typography; the header is sticky with a collapsible mobile nav and a large hero image. The stylesheet references Images/Portraits/D3/Header-Image.png for the hero background and includes layout sections such as .about-section, .portfolio (.product-grid / .product-card) and .book (form controls).

Key details from the provided styles.css

Design tokens: color and type variables declared in :root (e.g. --background: #111111; --accent: #d4a373).

Hero uses layered background + gradient and this image path: Images/Portraits/D3/Header-Image.png.

Responsive behavior: breakpoints at 1024px, 900px, 640px and 400px; mobile nav uses .nav-toggle and .nav-links.is-open.

Components styled: .product-grid (3-column desktop -> 2-column tablet), .book form, .footer-grid (three columns -> two on smaller screens).
Repository files (expected)

index.html — main markup (not provided here)
styles.css — provided (this file)
Images/… — image assets referenced by CSS (e.g. Images/Portraits/D3/Header-Image.png)
(optional) scripts/ or main.js — for toggling mobile nav (if present)
Quick start — run the site locally

Using VS Code Live Server (recommended)

Install the Live Server extension.
Open the project folder in VS Code.
Right-click index.html → "Open with Live Server".
Visit the URL Live Server opens (usually http://127.0.0.1:5500).
Using Python (no extensions)

From the project root run: python3 -m http.server 8000
Open http://localhost:8000 and click index.html.
Using Node (http-server)

From the project root run: npx http-server -c-1 . 8000
Open http://localhost:8000
Notes & recommended checks

Case-sensitive paths: CSS references Images/Portraits/D3/Header-Image.png — ensure the Images folder and subfolders match exactly (capitalization matters on Linux/macOS).

Mobile nav behavior: .nav-toggle gets aria-expanded="true" to animate bars and .nav-links.is-open to show the collapsed menu. If the menu doesn't open, add/verify JS that toggles aria-expanded and the is-open class.

Fonts: CSS references 'Playfair Display' and 'Inter' — include these (via Google Fonts or local) in index.html for accurate rendering.

Accessibility: .nav-toggle has :focus-visible styles; ensure the button is keyboard-focusable and uses aria-controls for the nav panel if you add JS.
Customization tips

Change color palette in :root variables (e.g. --accent, --background).
Adjust the product grid columns by editing .product-grid grid-template-columns.

Replace the hero image by changing the background-image url in .hero.
Troubleshooting

Images not showing: confirm path and file extension; open the image file URL directly in the browser.

Fonts not loading: check network tab for failed requests to Google Fonts; add fallback fonts in variables.

Layout overflow/scrollbars: html sets overflow-x: hidden to prevent sideways scroll — if content overflows, check min-width on children (several selectors reset min-width: 0).
Suggested README additions (optional)

Project name, author, contact
License (MIT, etc.)
Contribution guidelines
Build steps if you add tooling (npm, Tailwind, bundlers)

Styles:

A responsive, dark-themed portfolio landing page for "Aurora Photography" (index.html + styles.css). Key features: large hero with gradient overlay, sticky header with a collapsible mobile nav, a multi-row portfolio grid, an about section, and a booking form.
Evidence (from your files)

Hero background references Images/Portraits/D3/Header-Image.png in .hero (styles.css).
Mobile nav uses a .nav-toggle button with aria-expanded and a .nav-links.is-open class (index.html + styles.css).

Typography tokens declared in :root: --font-family-headings: 'Playfair Display' and --font-family-text: 'Inter' (styles.css).

Getting started — run locally

Recommended (VS Code Live Server)

Install Live Server extension in VS Code.
Open the project folder.
Right-click index.html → "Open with Live Server".
Visit the URL Live Server opens (e.g. http://127.0.0.1:5500).
Using Python (no extensions)

From the project root run: python3 -m http.server 8000
Open http://localhost:8000 and load index.html.
Using Node (http-server)

From the project root run: npx http-server -c-1 . 8000
Open http://localhost:8000
Files in this project

index.html — page markup (navigation, hero, portfolio, about, book form, footer)
styles.css — full styling and responsive breakpoints
nav.js — mobile navigation toggle (referenced at bottom of index.html)
Images/Portraits/D3/* — image assets used by the hero and portfolio
Development notes & recommended checks

nav.js: The mobile menu expects JS to toggle aria-expanded on .nav-toggle and add/remove .nav-links.is-open. If the menu doesn’t open on small screens, ensure nav.js implements:
toggleButton.setAttribute('aria-expanded', state)
navLinks.classList.toggle('is-open', state)

Fonts: styles.css references 'Playfair Display' and 'Inter'. Add Google Fonts <link> in <head> (or local fonts) for correct rendering. Example: <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">

Case-sensitive paths: CSS/HTML reference Images/Portraits/D3/... — ensure exact folder/file names (capitalization matters on Linux/macOS).

Accessibility: .nav-toggle has focus-visible styles; keep aria-controls and aria-expanded synchronized with JS.
Customisation tips

Colors & spacing: edit design tokens in :root (e.g. --background, --accent, --gap-page).
Grid: change .product-grid grid-template-columns for different column counts.

Hero image: replace Images/Portraits/D3/Header-Image.png or update .hero background-image.
Troubleshooting (quick)

Images not showing → open the image URL directly and check file path/case.
Fonts not loading → check network tab for 404s; add the Google Fonts link.
Mobile nav stuck closed → confirm nav.js toggles aria-expanded and .is-open class.
Suggested next steps I can help with

Provide a small nav.js implementation that toggles the menu and keeps aria attributes in sync.
Add a Google Fonts link and a polished meta/SEO block to index.html.
Generate a LICENSE or CONTRIBUTING file.