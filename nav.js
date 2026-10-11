/**
 * Mobile navigation: toggles the collapsed menu panel on phones and tablets.
 * The panel is only collapsible below 900px; above that the links are always
 * visible inline, so any open state is cleared when the viewport grows.
 */
(function () {
  var toggleButton = document.querySelector('.nav-toggle');
  var menu = document.getElementById('primary-navigation');
  var DESKTOP_QUERY = '(min-width: 901px)';

  if (!toggleButton || !menu) {
    return;
  }

  function isMenuOpen() {
    return menu.classList.contains('is-open');
  }

  function setMenuOpen(isOpen) {
    menu.classList.toggle('is-open', isOpen);
    toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleButton.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  }

  toggleButton.addEventListener('click', function () {
    setMenuOpen(!isMenuOpen());
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isMenuOpen()) {
      setMenuOpen(false);
      toggleButton.focus();
    }
  });

  var desktopViewport = window.matchMedia(DESKTOP_QUERY);

  function closeMenuOnDesktop(event) {
    if (event.matches) {
      setMenuOpen(false);
    }
  }

  if (typeof desktopViewport.addEventListener === 'function') {
    desktopViewport.addEventListener('change', closeMenuOnDesktop);
  } else if (typeof desktopViewport.addListener === 'function') {
    desktopViewport.addListener(closeMenuOnDesktop);
  }
})();
