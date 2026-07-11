// API: https://www.omdbapi.com/?i=tt3896198&apikey=46d31633
// Keep track of movies globally so both fetching and sorting can access them

const API_KEY = "46d31633";
const BASE_URL = "https://www.omdbapi.com/?i=tt3896198";

let globalMovies = []; 

async function fetchMovieData() {
    // 1. Changed 'i=' to 's=fast' to get a list/array of movies
    const response = await fetch("https://www.omdbapi.com/?s=fast&apikey=46d31633");
    const movieData = await response.json();
    
    // 2. Access the .Search array from the API response
    globalMovies = movieData.Search || []; 
    
    // 3. Render the initial list
    renderMovies();
}  

function moviehtml(movie) {
    return `<div class="movie">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
            <div class="info">
                <h2>${movie.Title}</h2>
                <div class="details">
                    <span class="year">${movie.Year}</span>
                </div>
            </div>
        </div>`;
}

async function renderMovies(sort) {
  const movieGrid = document.querySelector(".movie-grid");
  const movieList = document.querySelector(".movie-list");

  // Show loading state if you want, but toggle it safely
  movieList.classList.add('movies__loading');

  // If we don't have movies yet, stop here
  if (!globalMovies || globalMovies.length === 0) {
     movieList.classList.remove('movies__loading');
     return;
  }
  
  movieList.classList.remove('movies__loading');

  // Search
const container = document.getElementById("movies");





document
.getElementById("search")
.addEventListener("keyup", function(){

    if(this.value.length > 2){

        searchMovies(this.value);

    }

});


async function searchMovies(search = "fast") {

    const response = await fetch(
        `${BASE_URL}&apikey=${API_KEY}&s=${search}`
    );

    const data = await response.json();

    if (data.Response === "False") {
        container.innerHTML = "<h2>No movies found.</h2>";
        return;
    }

    globalMovies = data.Search || [];
    renderMovies()

}

  // Handle sorting logic
  if (sort === "az") {
    globalMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sort === "za") {
    globalMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sort === "newest") {
    globalMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sort === "oldest") {
    globalMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  // Map over the sorted array and inject it into the HTML
  movieList.innerHTML = globalMovies.map((movie) => moviehtml(movie)).join("");
}

function filterMovies(event) {
  // Pass the selected dropdown value to renderMovies
  renderMovies(event.target.value);
}

// Kick everything off on page load
fetchMovieData();