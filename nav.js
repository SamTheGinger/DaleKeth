/**
 * Mobile navigation: opens and closes the menu panel on phones and tablets.
 * The panel only collapses below 900px; above that the links are always
 * visible, so the menu is reset to closed when the window grows.
 */
(function () { // Starts a function that runs straight away (an "IIFE"). It keeps our variables private so they can't clash with other scripts.
  const toggleButton = document.querySelector('.nav-toggle'); // Finds the first element with class="nav-toggle" (the hamburger button) and stores it in a box named toggleButton. "const" means the box always holds this same thing.
  const menu = document.getElementById('primary-navigation'); // Finds the element with id="primary-navigation" (the menu list) and stores it in a box named menu.

  if (!toggleButton || !menu) { // "!" means NOT and "||" means OR: if the button OR the menu wasn't found...
    return; // ...stop here, so the script doesn't crash on a page without a menu.
  } // End of the if check.

  function isMenuOpen() { // Makes a small reusable helper called isMenuOpen. It answers "is the menu open right now?"
    return menu.classList.contains('is-open'); // Gives back true if the menu has the "is-open" class, otherwise false.
  } // End of the isMenuOpen helper.

  function setMenuOpen(isOpen) { // Makes a helper that opens the menu (when isOpen is true) or closes it (when isOpen is false).
    menu.classList.toggle('is-open', isOpen); // Adds the "is-open" class if isOpen is true and removes it if false. The CSS uses this class to show or hide the menu.
    toggleButton.setAttribute('aria-expanded', String(isOpen)); // Sets the button's aria-expanded to "true" or "false". This tells screen readers whether the menu is open, and the CSS uses it to turn the ☰ into an ✕.
    toggleButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu'); // Changes the button's spoken name. "condition ? A : B" means: if the condition is true use A, otherwise use B.
  } // End of the setMenuOpen helper.

  // Hamburger click: flip between open and closed.
  toggleButton.addEventListener('click', function () { // Tells the browser: "when the hamburger button is clicked, run this code".
    setMenuOpen(!isMenuOpen()); // Sets the menu to the OPPOSITE of how it is now: open becomes closed, closed becomes open.
  }); // End of the click instructions for the button.

  // Picking a link closes the menu so it doesn't cover the section.
  menu.addEventListener('click', function (event) { // When anything inside the menu is clicked, run this code. "event" holds details about the click.
    if (event.target.closest('a')) { // event.target is what was clicked; .closest('a') checks whether it is (or is inside) a link.
      setMenuOpen(false); // If a link was clicked, close the menu.
    } // End of the if check.
  }); // End of the click instructions for the menu.

  // Escape closes the menu and puts keyboard focus back on the button.
  document.addEventListener('keydown', function (event) { // When any key is pressed anywhere on the page, run this code.
    if (event.key === 'Escape' && isMenuOpen()) { // "===" means "is exactly equal to" and "&&" means AND: if the key was Escape AND the menu is open...
      setMenuOpen(false); // ...close the menu...
      toggleButton.focus(); // ...and move keyboard focus back onto the hamburger button, so keyboard users don't get lost.
    } // End of the if check.
  }); // End of the key-press instructions.

  // Growing the window to desktop width closes the menu.
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (event) { // Watches the screen width and runs this code whenever it crosses 901px (in either direction).
    if (event.matches) { // event.matches is true when the window is now 901px or wider (desktop size).
      setMenuOpen(false); // Reset the menu to closed, so it isn't stuck open if the window is made small again.
    } // End of the if check.
  }); // End of the screen-width instructions.
})(); // Ends the function, and the () on the end runs it immediately.
