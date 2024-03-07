// Express as our HTTP server
import Express from 'express'

// Bring in the router for our Movie API
import movieRouter from './api/movie.js'

// Make an express application
const app = new Express()

// Log all requests: logging route
// - All methods, all paths, no response (fall through)
app.use((req, res, next) => {
  console.log(`${req.method} request at ${req.path}`)
  next()
})

// Attach the movie routes
app.use('/data', movieRouter)

// Static file server
app.use(Express.static('public'))

// Start server listening on port 5000
app.listen(5000, () => {
  console.log('Listening on port 5000')
})
