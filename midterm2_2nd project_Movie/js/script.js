const apiKey = "2b3f14a28f88cce0f9e791b9b7358b35"; // Define the API key for accessing The Movie Database API.
const baseUrl = "https://api.themoviedb.org/3"; // Define the base URL for The Movie Database API.
const moviesGrid = document.getElementById("movies-grid"); // Select the container element to display movies.
const searchInput = document.getElementById("search-input"); // Select the search input element.
const suggestions = document.getElementById("suggestions"); // Select the suggestions container for displaying autocomplete results.

searchInput.addEventListener("input", async () => { // Add an event listener to handle input changes in the search box.
    const query = searchInput.value.trim(); // Get the trimmed value from the search input.
    if (query) { // Check if the input is not empty.
        const results = await searchMovies(query); // Fetch movie search results based on the query.
        showSuggestions(results); // Display suggestions based on the search results.
    } else {
        suggestions.style.display = "none"; // Hide suggestions if the input is empty.
    }
});

async function searchMovies(query) { // Define an asynchronous function to search movies based on a query.
    const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`); // Fetch search results from the API.
    const data = await response.json(); // Parse the JSON data from the response.
    return data.results; // Return the list of search results.
}

function showSuggestions(movies) { // Define a function to display movie suggestions.
    suggestions.innerHTML = movies
        .map(movie => `<div class="suggestions-item" onclick="redirectToSeries('${movie.title}')">${movie.title}</div>`)
        .join(""); // Generate HTML for each movie suggestion and join them into a single string.
    suggestions.style.display = "block"; // Display the suggestions container.
}

function redirectToMovie(movieId) { // Define a function to navigate to the movie details page.
    window.location.href = `movie-details.html?movieId=${movieId}`; // Redirect to the movie details page with the movie ID as a query parameter.
}

function redirectToSeries(query) { // Define a function to navigate to the movie series page.
    window.location.href = `movie-series.html?query=${encodeURIComponent(query)}&clearSearch=true`; // Redirect to the movie series page with the query parameter.
}

async function fetchMovies(url) { // Define an asynchronous function to fetch movies from a specific URL.
    const response = await fetch(url); // Fetch movies from the provided URL.
    const data = await response.json(); // Parse the JSON data from the response.
    displayMovies(data.results); // Display the fetched movies.
}

function displayMovies(movies) { // Define a function to display a list of movies on the page.
    moviesGrid.innerHTML = movies
        .map(movie => `
            <div class="movie" onclick="redirectToMovie(${movie.id})">
                <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../photo/err.png'}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Release date: ${movie.release_date}</p>
                <button class="watchlist-button" onclick="addToWatchlist(${movie.id}); event.stopPropagation();">Add to favorites</button>
            </div>
        `)
        .join(""); // Generate HTML for each movie and join them into a single string.
}

function sortMovies(criteria) { // Define a function to sort movies based on selected criteria.
    const url = `${baseUrl}/discover/movie?api_key=${apiKey}&sort_by=${criteria}`; // Build the URL with the sorting criteria.
    fetchMovies(url); // Fetch and display movies based on the selected criteria.
}

window.onload = () => { // Define a function to run when the page loads.
    fetchMovies(`${baseUrl}/movie/popular?api_key=${apiKey}`); // Fetch and display popular movies.
    if (window.location.pathname.endsWith('movie-details.html')) { // Check if the current page is the movie details page.
        displayMovieDetails(); // Display details for the specific movie.
    }
};

function addToWatchlist(movieId) { // Define a function to add a movie to the favorites (watchlist).
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []; // Retrieve the watchlist from local storage or set to empty array if null.
    if (!watchlist.includes(movieId)) { // Check if the movie is not already in the watchlist.
        watchlist.push(movieId); // Add the movie ID to the watchlist.
        localStorage.setItem("watchlist", JSON.stringify(watchlist)); // Save the updated watchlist to local storage.
        alert("Added to favorites!"); // Alert the user that the movie was added to the watchlist.
    } else {
        alert("The film is already in your favorites"); // Alert the user if the movie is already in the watchlist.
    }
}

async function showWatchlist() { // Define a function to display the user's favorites list.
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []; // Retrieve the watchlist from local storage or set to empty array if null.
    if (watchlist.length === 0) { // Check if the watchlist is empty.
        moviesGrid.innerHTML = "<p>Your favorites list is empty</p>"; // Display a message if the watchlist is empty.
        return; // Exit the function if the watchlist is empty.
    }

    // Fetch details for each movie in the watchlist.
    const promises = watchlist.map(id => 
        fetch(`${baseUrl}/movie/${id}?api_key=${apiKey}`).then(response => response.json())
    );
    const movies = await Promise.all(promises); // Wait for all movie details to be fetched.

    // Display each movie in the watchlist.
    moviesGrid.innerHTML = movies
        .map(movie => `
            <div class="movie" onclick="redirectToMovie(${movie.id})">
                <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../photo/err.png'}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Release date: ${movie.release_date}</p>
                <button class="watchlist-button" onclick="removeFromWatchlist(${movie.id}); event.stopPropagation();">Remove from favorites</button>
            </div>
        `)
        .join(""); // Generate HTML for each movie in the watchlist and join them into a single string.
}

function removeFromWatchlist(movieId) { // Define a function to remove a movie from the favorites (watchlist).
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []; // Retrieve the watchlist from local storage or set to empty array if null.
    watchlist = watchlist.filter(id => id !== movieId); // Remove the specified movie ID from the watchlist.
    localStorage.setItem("watchlist", JSON.stringify(watchlist)); // Save the updated watchlist to local storage.
    alert("Removed from favorites!"); // Alert the user that the movie was removed from the watchlist.
    showWatchlist(); // Refresh the watchlist display.
}
