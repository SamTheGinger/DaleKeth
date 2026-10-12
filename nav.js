/**
 * Mobile navigation: opens and closes the menu panel on phones and tablets.
 * The panel only collapses below 900px; above that the links are always
 * visible, so the menu is reset to closed when the window grows.
 */
(function () {
  const toggleButton = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-navigation');

  if (!toggleButton || !menu) {
    return;
  }

  function isMenuOpen() {
    return menu.classList.contains('is-open');
  }

  function setMenuOpen(isOpen) {
    menu.classList.toggle('is-open', isOpen);
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    toggleButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  // Hamburger click: flip between open and closed.
  toggleButton.addEventListener('click', function () {
    setMenuOpen(!isMenuOpen());
  });

  // Picking a link closes the menu so it doesn't cover the section.
  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      setMenuOpen(false);
    }
  });

  // Escape closes the menu and puts keyboard focus back on the button.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isMenuOpen()) {
      setMenuOpen(false);
      toggleButton.focus();
    }
  });

  // Growing the window to desktop width closes the menu.
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (event) {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
})();
