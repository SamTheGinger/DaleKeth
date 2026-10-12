# Code Walkthrough (Beginner's Guide)

A line-by-line tour of `index.html`, `styles.css` and `nav.js`. Line numbers refer to the current files.

---

## Part 1 — `index.html` (the content)

HTML is the *skeleton* of the page: it says **what** is on the page (headings, pictures, a form). It is made of **tags** like `<p>…</p>`. An opening tag `<p>` and a closing tag `</p>` wrap content. Extra info goes inside the opening tag as **attributes**, e.g. `class="logo"`.

### The `<head>` (lines 1–31): information *about* the page, not shown on it

| Line | Code | What it means |
|---|---|---|
| 1 | `<!DOCTYPE html>` | Tells the browser "this is modern HTML5". Always the first line. |
| 2 | `<html lang="en">` | Starts the page. `lang="en"` tells screen readers and Google the page is in English. |
| 3 | `<head>` | Opens the invisible "settings" part of the page. |
| 4 | `<meta charset="UTF-8">` | Use the UTF-8 alphabet, so symbols like `©` and `é` display correctly. |
| 5 | `<meta name="viewport" …>` | Makes the page fit phone screens instead of showing a shrunken desktop page. Without it, responsive CSS doesn't work on phones. |
| 6 | `<meta name="description" …>` | The short summary Google shows under your link in search results. |
| 7 | `<title>` | The text on the browser tab. |
| 8–9 | `<link rel="preconnect" …>` | "Start connecting to Google Fonts early" — makes fonts load a bit faster. |
| 10 | `<link … fonts.googleapis.com …>` | Downloads the **Inter** and **Playfair Display** fonts. Your CSS asked for these fonts, but before this line they were never loaded, so the browser was quietly using a fallback font. |
| 11 | `<link rel="stylesheet" href="styles.css">` | Connects your CSS file to the page. |
| 12 | `<!-- … -->` | An HTML comment. The browser ignores it; it's a note for humans. |
| 13–30 | `<noscript>…</noscript>` | Code that runs **only if JavaScript is turned off**. On small screens the menu needs JavaScript to open, so this shows the links directly instead. `!important` means "this rule wins over any other rule". |
| 14–29 | `<style> @media (max-width: 900px) {…}` | Little CSS block: "on screens 900px wide or less, show the links in a row and hide the hamburger button". |
| 31 | `</head>` | Closes the head. |

### The `<body>` (line 32 onwards): everything you actually see

**Header and navigation (lines 33–49)**

| Line | Code | What it means |
|---|---|---|
| 33 | `<header>` | The top bar of the site. |
| 34 | `<nav>` | Tells browsers and screen readers "this is the main menu". |
| 35 | `<a href="#hero" class="logo">Aurora<span>Photography.</span></a>` | The logo is a link. `href="#hero"` jumps to the element with `id="hero"` (the top of the page). The `<span>` wraps "Photography." so the CSS can colour it grey. |
| 36 | `<button … class="nav-toggle" …>` | The hamburger (☰) button for phones. `type="button"` means "this does not submit a form". `aria-label` is the button's name read out by screen readers. `aria-expanded="false"` says "the menu is currently closed". `aria-controls` says which element the button opens (the list with `id="primary-navigation"`). |
| 37–39 | `<span class="nav-toggle-bar">` ×3 | The three lines of the hamburger icon, drawn with CSS. |
| 40 | `</button>` | End of the button. |
| 41 | `<ul class="nav-links" id="primary-navigation">` | `<ul>` = unordered list. It holds the menu links. The `id` lets JavaScript find it. |
| 42–46 | `<li><a href="#portfolio">Portfolio</a></li>` | Each `<li>` is a list item holding one link. `#portfolio` scrolls to the section with `id="portfolio"`. |
| 47–49 | `</ul> </nav> </header>` | Closing tags. |

**Main content (line 51)**

`<main>` wraps the main content of the page. Each `<section>` inside it is one area of the page, and its `id` is what the menu links jump to.

**Hero (lines 52–55)** — the big banner image at the top.

- `<section id="hero" class="hero">` — the `class` connects it to the `.hero` CSS that adds the background photo.
- `<p class="eyebrow">` — a small line of text above the main heading (designers call this an "eyebrow").
- `<h1>Capturing <span>Beauty.</span></h1>` — the main heading. A page should have **only one `<h1>`**. That's why the "Book Your Photoshoot" heading was changed to an `<h2>`.

**Portfolio (lines 57–121)**

- `<h2>` — a second-level heading.
- `<div class="product-grid">` — **one** container for all 12 photos. CSS lays them out in rows of 3, 2 or 1 depending on screen size. (Previously there were 4 separate grids of 3. On tablets, which show 2 per row, every grid left a lonely card on its own row.)
- Each photo is the same pattern, for example lines 60–64:

  ```html
  <article class="product-card">                                     <!-- one self-contained card -->
    <img src="Images/Portraits/D3/1.png" alt="Copper" class="product-image">  <!-- the photo -->
    <h3>Copper</h3>                                                   <!-- the photo's title -->
    <p class="category">Portrait</p>                                  <!-- small label underneath -->
  </article>
  ```

  `src` is the file path to the picture. `alt` is the text shown if the image fails, and it's read aloud to blind users. `<img>` has no closing tag.

**About (lines 123–131)**

- `<section id="about" class="about-section">` holds two `<div>`s side by side: `about-content` (heading and paragraph) and `about-image` (the photographer's picture).
- `<div>` is a plain box with no meaning of its own. It exists so CSS can position things.

**Booking form (lines 133–157)**

| Code | What it means |
|---|---|
| `<form>` | A form people fill in. It has no `action`, so pressing the button currently just reloads the page (see "Next steps" in the README). |
| `<label for="name">` | The visible text "Name:". `for="name"` links it to the input with `id="name"`, so clicking the label puts the cursor in the box. |
| `<input type="text" … required>` | A text box. `placeholder` is the grey hint text. `required` stops the form submitting while the box is empty. `autocomplete="name"` lets the browser offer to fill it in. |
| `type="email"` / `type="tel"` | An email box (the browser checks there's an `@`) and a phone number box (phones show a number keypad). |
| `<select>` + `<option>` | A dropdown menu. The first option has `value=""`, so with `required` the person must pick a real style. |
| `<button type="submit">` | Sends the form. |

**Footer (lines 160–182)**

- `<footer id="contact">` — the bottom of the page. The "Contact" menu link jumps here.
- `footer-grid` holds three columns: brand, links and contact details.
- `<a href="mailto:…">` — clicking the email address opens the visitor's email app.
- `&copy;` — HTML code for the © symbol.

**Script (line 184)**

`<script src="nav.js"></script>` loads the JavaScript. It sits at the bottom so the HTML above already exists when the script runs.

---

## Part 2 — `styles.css` (the looks)

CSS is the *paint and layout*. Every rule has the same shape:

```css
selector {          /* WHICH elements to style   */
  property: value;  /* WHAT to change, and to what */
}
```

**Selector cheat-sheet**

| Selector | Picks… |
|---|---|
| `*` | every element |
| `nav` | every `<nav>` tag |
| `.logo` | every element with `class="logo"` |
| `.logo span` | a `<span>` *inside* something with `class="logo"` |
| `a:hover` | a link while the mouse is over it |
| `:focus` / `:focus-visible` | an element selected with the keyboard (Tab key) |
| `:nth-child(2)` | the 2nd child of its parent |
| `[aria-expanded="true"]` | an element whose attribute has that value |
| `::placeholder` | the grey hint text inside an input |

**Unit cheat-sheet**

| Unit | Meaning |
|---|---|
| `px` | pixels (fixed size) |
| `rem` | a multiple of the base font size (usually 16px), so `2rem` = 32px |
| `vw` | 1% of the screen's width |
| `%` | a percentage of the parent element |
| `fr` | "one share of the leftover space" (used in grids) |
| `clamp(min, ideal, max)` | "use the ideal size, but never smaller than min or bigger than max". This is how text grows and shrinks smoothly with the screen. |

**Property cheat-sheet** (properties that come up again and again)

| Property | What it does |
|---|---|
| `margin` | Space **outside** an element's border. `margin: 0 auto` centres a block horizontally. |
| `padding` | Space **inside** the border, around the content. |
| Two/four values | `padding: 1rem 2rem` = top & bottom 1rem, left & right 2rem. Four values go clockwise: top, right, bottom, left. |
| `padding-inline` / `margin-inline` | Left and right only. |
| `color` | Text colour. |
| `background` / `background-color` | Fill colour behind the element. |
| `font-family` / `font-size` / `font-weight` | Which font, how big, how bold (`600` = semi-bold). |
| `text-align: center` | Centre the text. |
| `text-transform: uppercase` | SHOW IN CAPITALS. |
| `letter-spacing` | Space between letters. |
| `line-height` | Space between lines of text. |
| `border: 2px solid red` | Thickness, style, colour. |
| `border-radius` | Rounded corners. |
| `width` / `max-width` | How wide something is, and the most it can grow to. |
| `display: block` | Takes a full line of its own. |
| `display: inline-block` | Sits in a line of text but can have padding and a width. |
| `display: flex` | Lays out the children in a row (or a column with `flex-direction: column`). `justify-content` spaces them along the row; `align-items` lines them up across it. `flex-wrap: wrap` lets them flow onto a new line. |
| `display: grid` | Lays out the children in rows and columns. `grid-template-columns` sets the columns. |
| `gap` | Space between flex or grid children. |
| `display: none` | Hides the element completely. |
| `position` | `sticky` = sticks to the top while scrolling. `relative` = "children can be positioned against me". `absolute` = placed exactly, relative to that parent. |
| `z-index` | Stacking order. A higher number sits on top. |
| `transition` | Animates changes smoothly instead of jumping. `0.2s ease` = over 0.2 seconds, starting and ending gently. |
| `transform` | Moves, rotates or scales an element (`translateY(-8px)` = move up 8px). |
| `cursor: pointer` | Shows the 👆 hand cursor. |
| `var(--name)` | Uses a value stored in a variable (see Design tokens). |

### Section by section

**Reset (lines 1–6)**

- `* { margin: 0; padding: 0; }` — browsers add their own spacing to headings, paragraphs and so on. This removes all of it, so you control every space yourself.
- `box-sizing: border-box` — makes `width` include the padding and border. Without it, a 100px box with 10px padding would actually be 120px wide.

**Design tokens (lines 8–21)**

- `:root` means "the whole page". Lines starting with `--` create **variables**, e.g. `--accent: #d4a373` (the gold colour).
- Anywhere else, `var(--accent)` means "use the gold colour". To change the colour scheme of the whole site, you only edit these lines.
- `#111111` is a **hex colour**: red, green and blue values in pairs. `#111111` is nearly black.
- `--font-family-headings: 'Playfair Display', serif` — use Playfair Display, and if it fails, any serif font.

**Base (lines 23–60)**

- `html`: `scroll-behavior: smooth` makes menu links glide instead of jumping. `scroll-padding-top` stops the sticky header covering section titles. `text-size-adjust` stops phones inflating text. `overflow-x: hidden` blocks sideways scrolling.
- `body`: sets the default font, background, text colour and line spacing. `overflow-wrap: break-word` lets very long words break onto the next line instead of overflowing.
- `a`: links take their parent's colour and lose the default underline.
- `ul`: removes the bullet points from lists.
- `img, svg, …`: media can never be wider than its container.
- `img`: `height: auto` keeps the right proportions. `display: block` removes a small gap browsers leave under images.

**min-width reset (lines 62–77)**

This fixes a common bug: flex and grid children refuse to shrink smaller than their content, which can push the page wider than the screen. `min-width: 0` lets them shrink.

**Header (lines 79–177)**

- `header`: `position: sticky; top: 0` keeps the bar at the top while you scroll. `z-index: 10` keeps it above the photos.
- `nav`: a flex row with the logo on the left and the links on the right (`space-between`), at most 1100px wide and centred.
- `.logo`, `.logo span`: big white logo text with a grey "Photography."
- `.nav-toggle`: the hamburger button. It's **hidden on desktop** (`display: none`) and only appears in the 900px media query. Its `flex-direction: column` stacks the three bars.
- `:hover` gives it a faint gold tint. `:focus-visible` draws an outline when someone reaches it with the Tab key.
- `.nav-toggle-bar`: each bar is a 2px-tall gold line.
- Lines 145–155 handle the hamburger-to-X animation. When the JavaScript sets `aria-expanded="true"`, bar 1 moves down and rotates 45°, bar 2 fades out, and bar 3 moves up and rotates −45°. Together they make an ✕.
- `.nav-links`: the menu laid out as a row. `.nav-links a`: gold, semi-bold, `white-space: nowrap` (never split "Portfolio" across two lines), and it turns grey on hover.

**Hero (lines 179–219)**

- `background-image` has two layers: a 60% black see-through layer (`linear-gradient(rgba(0,0,0,0.6) …)`) on top of the photo, so the white text is easy to read. `rgba` = red, green, blue, opacity.
- `background-size: cover` fills the whole area without stretching the photo. `background-position: center` keeps the middle of the photo visible.
- `min-height: 600px`: the banner is at least 600px tall.
- `display: flex; flex-direction: column; justify-content: center; align-items: center` is the classic recipe for "centre everything vertically and horizontally".
- `.eyebrow`: small, gold, uppercase and spaced out.
- `.hero h1`: the big heading. `clamp(2rem, 9vw, 3.75rem)` means it's 32px on tiny phones and 60px on large screens.

**Portfolio (lines 221–278)**

- `.portfolio`: a centred column, at most 1100px wide.
- `.product-grid`: `grid-template-columns: repeat(3, minmax(0, 1fr))` makes 3 equal columns. `gap` takes two values: space between rows, then space between columns.
- `.product-card`: a gold border with rounded corners. `overflow: hidden` clips the photo to those rounded corners. On `:hover` the card floats up 8px, and the `transition` makes that smooth.
- `.product-image`: `aspect-ratio: 1 / 1` makes every photo a square. `object-fit: cover` crops the photo to fill the square instead of squashing it.
- `.product-card h3` and `.category`: the title and the small gold uppercase label.

**About (lines 280–330)**

- `.about-section`: a flex row with the text and the photo side by side, wrapping if there isn't room.
- `.about-image`: `flex: 0 1 30%` means "don't grow, may shrink, start at 30% width". It floats up on hover, like the cards.
- `.about-content`: `flex: 1 1 60%` means "grow and shrink as needed, start at 60%".

**Book (lines 332–429)**

- `.book`: a dark grey card, at most 560px wide and centred, with a soft `box-shadow`.
- `.book label`: each label sits on its own line (`display: block`), bold and uppercase.
- `.book input` and `.custom-dropdown select`: full-width white boxes with dark text. `font-size: 16px` stops iPhones zooming in when you tap a box.
- `outline: none` removes the browser's default focus outline, so lines 404–407 add a replacement: the border turns gold when the box is selected. Keyboard users need this to see where they are.
- `.book button`: a full-width gold button. It turns grey on hover and shrinks slightly (`scale(0.98)`) while pressed, which feels like a real button.

**Footer (lines 431–489)**

- `.footer-grid`: `grid-template-columns: 2fr 1fr 1fr` makes the first column twice as wide as the other two.
- When several selectors are separated by commas (e.g. `.footer-links h3, .footer-contact h3`), they share the same rule. This avoids writing the same styles twice.
- `.footer-brand p:last-child` targets the last paragraph in the brand column (the tagline).
- `.copyright`: `margin: 3rem 0` = 3rem above and below, 0 on the sides.

**Responsive (lines 491–678)**

`@media (max-width: 900px) { … }` means "apply these rules **only** when the screen is 900px wide or less". Rules inside override the ones above.

| Breakpoint | What changes |
|---|---|
| ≤ 1024px | Footer columns get a bit more even. |
| ≤ 900px (tablets) | The hamburger button appears. `.nav-links` becomes a hidden drop-down panel (`position: absolute; top: 100%` places it right under the header; `display: none` hides it). `.nav-links.is-open { display: flex }` shows it when the JavaScript adds the `is-open` class. The About section stacks vertically, the portfolio drops to 2 columns, and the footer to 2 columns. |
| ≤ 640px (phones) | Tighter padding, a smaller hero, **1 photo per row** (max 26rem wide), a narrower form card and a 1-column footer. |
| ≤ 400px (small phones) | An even smaller hero, smaller gaps and thinner card borders. |

---

## Part 3 — `nav.js` (the behaviour)

JavaScript makes the page *do* things. Here it only opens and closes the phone menu.

| Line | Code | What it means |
|---|---|---|
| 1–5 | `/** … */` | A comment explaining what the file is for. |
| 6 | `(function () {` | Wraps all the code in a function that runs immediately (an "IIFE"). This keeps the variable names private so they can't clash with other scripts. |
| 7 | `const toggleButton = document.querySelector('.nav-toggle');` | Finds the first element with class `nav-toggle` (the hamburger) and stores it in a box called `toggleButton`. `const` means the box won't be swapped for something else. |
| 8 | `const menu = document.getElementById('primary-navigation');` | Finds the menu list by its `id`. |
| 10–12 | `if (!toggleButton \|\| !menu) { return; }` | `!` means "not", `\|\|` means "or". "If either one is missing, stop here", so the script never crashes on a page without a menu. |
| 14–16 | `function isMenuOpen() { return menu.classList.contains('is-open'); }` | A small helper that answers true or false: does the menu currently have the `is-open` class? |
| 18 | `function setMenuOpen(isOpen) {` | A helper that opens the menu (`isOpen` = `true`) or closes it (`false`). |
| 19 | `menu.classList.toggle('is-open', isOpen);` | Adds the `is-open` class if `isOpen` is true and removes it if false. The CSS does the actual showing and hiding. |
| 20 | `toggleButton.setAttribute('aria-expanded', String(isOpen));` | Updates the button's `aria-expanded` to `"true"` or `"false"`. This tells screen readers the menu's state **and** triggers the CSS ☰ → ✕ animation. |
| 21 | `… isOpen ? 'Close navigation menu' : 'Open navigation menu'` | `condition ? A : B` means "if the condition is true use A, otherwise B". It updates the button's spoken name. |
| 25–27 | `toggleButton.addEventListener('click', function () { setMenuOpen(!isMenuOpen()); });` | "When the button is clicked, set the menu to the **opposite** of what it is now." |
| 30–34 | `menu.addEventListener('click', …)` | When anything inside the menu is clicked, `event.target.closest('a')` checks whether it was a link. If it was, the menu closes so you can see the section you jumped to. |
| 37–42 | `document.addEventListener('keydown', …)` | Listens for key presses anywhere on the page. If the key is `Escape` (`===` means "exactly equals") and the menu is open, it closes the menu and moves keyboard focus back to the button. |
| 45–49 | `window.matchMedia('(min-width: 901px)').addEventListener('change', …)` | Watches the screen width. When the window grows past 900px (`event.matches` is true), the menu is reset to closed, so it isn't stuck open if you shrink the window again later. |
| 50 | `})();` | Ends the function, and the `()` runs it straight away. |
