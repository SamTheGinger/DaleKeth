// main.jsx is the very first JavaScript file that runs. It puts the React app onto the page.
import { StrictMode } from 'react' // StrictMode is a helper that warns about common mistakes while you're developing.
import { createRoot } from 'react-dom/client' // createRoot connects React to a real element on the web page.
import './index.css' // Loads our styles (Tailwind plus our colours and fonts) for the whole site.
import App from './App.jsx' // The top-level component that contains the whole website.

// Find the empty <div id="root"> in index.html, and draw the App inside it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
