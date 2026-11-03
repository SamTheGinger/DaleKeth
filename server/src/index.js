// Local / long-running entry point. On Vercel the exported Express app is invoked directly.
import app from './app.js'
import { PORT } from './config.js'

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
