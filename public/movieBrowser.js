(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // client/dataHelper.js
  function retrieveMoviesAsync() {
    return __async(this, null, function* () {
      const response = yield fetch("./data/movie");
      const data = yield response.json();
      return data;
    });
  }
  function retrieveDetailsAsync(movieId) {
    return __async(this, null, function* () {
      const response = yield fetch(`/data/movie/${movieId}`);
      const data = yield response.json();
      return data;
    });
  }

  // client/movieBrowser.js
  var detailsModal = new bootstrap.Modal("#detailsModal");
  document.addEventListener("DOMContentLoaded", () => __async(void 0, null, function* () {
    try {
      const movieData = yield retrieveMoviesAsync();
      if (movieData && Array.isArray(movieData)) {
        renderAllMoviesAsCards(movieData);
      }
    } catch (error) {
      console.error("Failed to retrieve data");
      console.error(error);
      window.alert("Data retrieval error");
    }
  }));
  function renderAllMoviesAsCards(movieData) {
    const movieRowDiv = document.querySelector("#movieRow");
    movieData.forEach((movie) => {
      const movieCardDiv = document.createElement("div");
      movieCardDiv.className = "col-sm-6 col-md-4 col-lg-3";
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
          ${movie.genres.join(", ")}<br/>
          ${movie.rated}, ${movie.year}
        </span>
      </div> <!-- /movieSummary-->
    `;
      movieRowDiv.appendChild(movieCardDiv);
    });
    const allLinks = document.querySelectorAll(".detailsLink");
    const arrayLinks = Array.from(allLinks);
    arrayLinks.forEach((link) => {
      link.addEventListener("click", detailsRequested);
    });
  }
  function detailsRequested(event) {
    return __async(this, null, function* () {
      event.preventDefault();
      const movieId = event.currentTarget.dataset.movieId;
      try {
        const details = yield retrieveDetailsAsync(movieId);
        const keys = Object.keys(details);
        keys.forEach((key) => {
          const element = document.querySelector(`#details-${key}`);
          if (!element) {
            console.error(`Failed to find details element for ${key}`);
          } else {
            if (key === "image") {
              element.setAttribute("src", `../images/posters/${details[key]}`);
              element.setAttribute("alt", `Movie poster for "${details.title}`);
            } else {
              if (Array.isArray(details[key])) {
                element.textContent = details[key].join(", ");
              } else {
                element.textContent = details[key];
              }
            }
          }
        });
        detailsModal.show();
      } catch (error) {
        console.error("Failed to retrieve/display movie details");
        console.error(error);
        window.alert("Error retrieving/showing details (see console)");
      }
    });
  }
})();
//# sourceMappingURL=movieBrowser.js.map
