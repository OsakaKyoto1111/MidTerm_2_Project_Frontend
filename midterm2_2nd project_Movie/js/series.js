const apiKey = "2b3f14a28f88cce0f9e791b9b7358b35"; // Define the API key for accessing The Movie Database API.
const baseUrl = "https://api.themoviedb.org/3"; // Define the base URL for The Movie Database API.
const moviesGrid = document.getElementById("movies-grid"); // Select the container element to display movies.
const loadingIndicator = document.getElementById("loading"); // Select the loading indicator element.
let moviesList = []; // Initialize an empty array to store the list of movies.

async function fetchSeriesMovies(query) { // Define an asynchronous function to fetch movies based on a search query.
    loadingIndicator.style.display = "block"; // Show the loading indicator while fetching data.
    try {
        // Fetch movies from the API based on the provided query.
        const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json(); // Parse the JSON data returned from the API.
        moviesList = data.results; // Store the fetched movies in the moviesList array.
        displayMovies(moviesList); // Display the fetched movies.
    } catch (error) {
        console.error("Error when receiving movies:", error); // Log any error that occurs during the API fetch.
        moviesGrid.innerHTML = "<p>An error occurred while receiving movies</p>"; // Display an error message if the fetch fails.
    } finally {
        loadingIndicator.style.display = "none"; // Hide the loading indicator after data is loaded or if an error occurs.
    }
}

function displayMovies(movies) { // Define a function to display movies on the page.
    if (movies.length === 0) { // Check if there are no movies found.
        moviesGrid.innerHTML = "<p>No movies found for your request</p>"; // Display a message if no movies were found.
        return; // Exit the function if no movies were found.
    }

    // Generate HTML for each movie and add it to the moviesGrid.
    moviesGrid.innerHTML = movies
        .map(movie => 
            `<div class="movie">
                <a href="movie-details.html?movieId=${movie.id}">
                    <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../photo/err.png'}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>Release date: ${movie.release_date}</p>
                </a>
                <button class="watchlist-button" onclick="addToWatchlist(${movie.id}); event.stopPropagation();">Add to watch list</button>
            </div>`
        )
        .join(""); // Join the array of movie HTML elements into a single string.
}

function sortMovies() { // Define a function to sort the movies based on selected criteria.
    const sortBy = document.getElementById("sort-option2").value; // Get the selected sorting option.
    let sortedMovies = [...moviesList]; // Create a copy of moviesList to avoid modifying the original array.

    // Sort movies based on the selected criteria.
    if (sortBy === "popularity.desc") {
        sortedMovies.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === "release_date.desc") {
        sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === "vote_average.desc") {
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
    }

    displayMovies(sortedMovies); // Display the sorted movies.
}

function goBack() { // Define a function to navigate back to the previous page.
    window.history.back(); // Go back to the previous page in the browser's history.
}

window.onload = () => { // Define a function to run when the page loads.
    const params = new URLSearchParams(window.location.search); // Get the URL search parameters.
    const query = params.get("query"); // Get the "query" parameter from the URL.
    if (query) { // If a query is provided...
        fetchSeriesMovies(query); // Fetch movies based on the query.
    }
};

function addToWatchlist(movieId) { // Define a function to add a movie to the watchlist.
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []; // Retrieve the watchlist from local storage or set it to an empty array if null.
    if (!watchlist.includes(movieId)) { // Check if the movie is not already in the watchlist.
        watchlist.push(movieId); // Add the movie ID to the watchlist.
        localStorage.setItem("watchlist", JSON.stringify(watchlist)); // Save the updated watchlist to local storage.
        alert("Added to watchlist!"); // Alert the user that the movie was added to the watchlist.
    } else {
        alert("The film is already on the watch list"); // Alert the user if the movie is already in the watchlist.
    }
}
