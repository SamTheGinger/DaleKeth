// Settings for Vite, the tool that runs the development server (npm run dev)
// and builds the finished website (npm run build).
import react from '@vitejs/plugin-react' // Teaches Vite how to understand React's JSX files.
import tailwindcss from '@tailwindcss/vite' // Teaches Vite how to turn Tailwind classes into real CSS.
import { defineConfig } from 'vite' // A helper that gives your code editor hints about the settings below.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Switch both plugins on.
})
