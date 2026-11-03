import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['.app.github.dev'], // GitHub Codespaces port forwarding
    // Mirrors the production rewrite in vercel.json so the auth cookie is same-origin in development too.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
