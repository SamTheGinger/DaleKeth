// A tiny "router": it works out which page to show from the part of the web address after the #.
//
// Why the #? Everything after # in an address (the "hash") can change without the browser
// loading a new page, and the browser's Back and Forward buttons still work with it.
// We use two kinds of hash:
//   #/gallery/3   starts with #/  -> a separate page (here: the gallery for photo 3)
//   #/signin      the same, with no number -> the Sign In page (id comes out as NaN, "not a number", and isn't used)
//   #portfolio    no slash        -> the home page, scrolled to the section with id="portfolio"
//
// A "hook" is a reusable function that uses React features like useState.
// React's rule: hook names start with "use".
import { useEffect, useState } from 'react' // Loads two built-in React hooks we need.

// Reads the current address and turns it into a simple object describing the page.
function readRoute() {
  const hash = window.location.hash // e.g. '#/gallery/3' or '#portfolio' or '' (nothing).

  if (hash.startsWith('#/')) { // If the hash starts with #/, it's one of our separate pages.
    const [page, id] = hash.slice(2).split('/') // slice(2) drops the '#/', split('/') cuts 'gallery/3' into ['gallery', '3'].
    return { page: page, id: Number(id) } // Number('3') turns the text '3' into the number 3, so it matches the ids in our data files.
  }

  return { page: 'home', anchor: hash.slice(1) } // Otherwise it's the home page. slice(1) drops the '#', so '#portfolio' becomes 'portfolio'.
}

function useHashRoute() {
  // useState stores a value that, when changed, makes React redraw the screen.
  // route is the current value; setRoute is the function that changes it.
  // Passing readRoute (without brackets) tells React to call it once to get the starting value.
  const [route, setRoute] = useState(readRoute)

  // useEffect runs code after React has drawn the page. Here it starts listening for address changes.
  useEffect(() => {
    function handleHashChange() { // Runs every time the part after # changes (clicking a link, Back button, etc.).
      setRoute(readRoute()) // Read the new address and store it, which redraws the page.
    }
    window.addEventListener('hashchange', handleHashChange) // Ask the browser to call handleHashChange whenever the hash changes.
    return () => window.removeEventListener('hashchange', handleHashChange) // Clean-up: stop listening if this is ever removed from the page.
  }, []) // The empty [ ] means "only set this up once, when the app first loads".

  return route // Give the current route to whoever used this hook (App.jsx).
}

export default useHashRoute // Lets App.jsx load this with: import useHashRoute from './utils/useHashRoute.js'
