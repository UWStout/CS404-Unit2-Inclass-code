import Express from 'express'

import fs from 'fs'

// Read in the movie data and parse the JSON
const myRawData = fs.readFileSync('./server/data/myflixdata-2024.json', {
  encoding: 'utf8'
})
const movieData = JSON.parse(myRawData)

// Create a summarized form of the movie data
const summarizedMovies = movieData.map((movie) => ({
  id: movie.id,
  title: movie.title,
  year: movie.year,
  genres: movie.genres,
  image: movie.image,
  rated: movie.rated
}))

// Make an express router
const dataRouter = new Express.Router()

// Respond with summarized movie list
// - get methods, /movie path, responds
dataRouter.get('/movie', (req, res) => {
  res.status(200).json(summarizedMovies)
})

// Respond with full movie details
// - Get methods, /movie/[id] path, responds
dataRouter.get('/movie/:id', (req, res) => {
  // Search for the requested movie
  const movieID = req.params.id
  const movieDetails = movieData.find((movie) => movie.id === movieID)

  // If found, return the movie, otherwise, return a 404
  if (!movieDetails) {
    res.status(404).json({ error: true, message: 'movie not found' })
  } else {
    res.json(movieDetails)
  }
})

// Expose the dataRouter for importing
export default dataRouter
