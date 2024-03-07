// Bring in the retrieveMovies function for local use
import { retrieveMoviesAsync, retrieveDetailsAsync } from './dataHelper.js'

// Construct our BS Modal
const detailsModal = new bootstrap.Modal('#detailsModal')

// Run initialization code when the page finishes loading
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Retrieve all the movie data
    const movieData = await retrieveMoviesAsync()

    // 2. Render all movies as movie cards
    if (movieData && Array.isArray(movieData)) {
      renderAllMoviesAsCards(movieData)
    }
  } catch (error) {
    // Catch any errors and report them
    console.error('Failed to retrieve data')
    console.error(error)
    window.alert('Data retrieval error')
  }
})

// Build cards based on the array of movies and append them
// to the movie row of the grid.
function renderAllMoviesAsCards (movieData) {
  // Retrieve reference to the movie row element
  const movieRowDiv = document.querySelector('#movieRow')

  // Loop over all movies in the array
  movieData.forEach((movie) => {
    // Build a new div with the needed class names
    const movieCardDiv = document.createElement('div')
    movieCardDiv.className = 'col-sm-6 col-md-4 col-lg-3'

    // Set inner HTML with the movie data
    movieCardDiv.innerHTML = `
      <div class='movieSummary'>
        <a data-movie-id='${movie.id}' class='detailsLink'>
          <span class="summaryTitle">${movie.title}</span>
          <img
            src="../images/thumbs/${movie.image}"
            alt="Poster for the movie ${movie.title}"
            height="250px"
          />
        </a><br/>
        <span class="summaryInfo">
          ${movie.genres.join(', ')}<br/>
          ${movie.rated}, ${movie.year}
        </span>
      </div> <!-- /movieSummary-->
    `

    // Append the new card to the movie row
    movieRowDiv.appendChild(movieCardDiv)
  })

  // Fix the link tags
  const allLinks = document.querySelectorAll('.detailsLink')
  const arrayLinks = Array.from(allLinks)
  arrayLinks.forEach((link) => {
    link.addEventListener('click', detailsRequested)
  })
}

async function detailsRequested (event) {
  // Prevent visiting the link
  event.preventDefault()

  // Extract the href attribute from the link tag
  const movieId = event.currentTarget.dataset.movieId

  try {
    // Get the movie details asynchronously
    const details = await retrieveDetailsAsync(movieId)

    // Fill in all the detail elements
    // NOTE: I didn't get to this part in class. It coordinates with the
    //       complicated bits in index.html so see index.html and all the
    //       elements with id="details-???" that I added.

    // Get an array containing all the properties of the 'details' object
    // as strings then loop over all those properties
    const keys = Object.keys(details)
    keys.forEach((key) => {
      // For each property, get the element with a matching 'details-??' ID
      const element = document.querySelector(`#details-${key}`)
      if (!element) {
        console.error(`Failed to find details element for ${key}`)
      } else {
        // We must handle the 'image' property differently
        if (key === 'image') {
          // Set both the 'src' and 'alt' attributes for the 'img' tag
          element.setAttribute('src', `../images/posters/${details[key]}`)
          element.setAttribute('alt', `Movie poster for "${details.title}`)
        } else {
          // All other properties, set the text content
          if (Array.isArray(details[key])) {
            element.textContent = details[key].join(', ')
          } else {
            element.textContent = details[key]
          }
        }
      }
    })

    // Now that all the details are fill in, show the modal
    detailsModal.show()
  } catch (error) {
    console.error('Failed to retrieve/display movie details')
    console.error(error)
    window.alert('Error retrieving/showing details (see console)')
  }
}
