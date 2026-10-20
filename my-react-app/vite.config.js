// Settings for Vite, the tool that runs the development server (npm run dev)
// and builds the finished website (npm run build).
import react from '@vitejs/plugin-react' // Teaches Vite how to understand React's JSX files.
import tailwindcss from '@tailwindcss/vite' // Teaches Vite how to turn Tailwind classes into real CSS.
import { defineConfig } from 'vite' // A helper that gives your code editor hints about the settings below.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Switch both plugins on.
  server: {
    // Let the dev server answer GitHub Codespaces web addresses (…-5173.app.github.dev).
    // Without this, opening the forwarded port shows "Blocked request. This host is not allowed."
    allowedHosts: ['.app.github.dev'],
    // Forward every request starting with /api to the Express server (cd server && npm run dev).
    // The browser only ever talks to one address, just like on Vercel (see vercel.json),
    // so the sign-in cookie works the same way in development and production.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
