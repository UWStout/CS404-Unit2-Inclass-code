/**
 * Retrieve all movie data from the server. Identical in behavior and
 * signature to the retrieveMovies() method, but uses async-await.
 *
 * @returns {Promise(object[])} Promise that resolves to an array of movies
 */
export async function retrieveMoviesAsync () {
  const response = await fetch('./data/movie')
  const data = await response.json()
  return data
}

/**
 * Retrieve details for a single movie using the given URL
 *
 * @returns {Promise(object[])} Promise that resolves to an array of movies
 */
export async function retrieveDetailsAsync (movieId) {
  const response = await fetch(`/data/movie/${movieId}`)
  const data = await response.json()
  return data
}
