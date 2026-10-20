// Starts the API server: `npm run dev` (restarts when you save a file) or `npm start`.
import app from './app.js'
import { PORT } from './config.js'

// 0.0.0.0 = accept connections from outside the machine, which Railway needs.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on http://localhost:${PORT} (try /api/health)`)
})
