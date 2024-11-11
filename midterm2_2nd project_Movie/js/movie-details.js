const apiKey = "2b3f14a28f88cce0f9e791b9b7358b35"; // Define the API key for accessing The Movie Database API.
const movieId = new URLSearchParams(window.location.search).get("movieId"); // Get the "movieId" parameter from the URL query.
const defaultPoster = "../photo/err.png"; // Define a default poster image for movies with no poster available.

async function fetchMovieDetails(movieId) { // Define an asynchronous function to fetch movie details by ID.
    try {
        // Fetch movie details, including credits and videos, from the API.
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`);
        const movie = await response.json(); // Parse the JSON data from the response.

        document.getElementById("movie-title").innerText = movie.title; // Display the movie title.
        document.getElementById("movie-poster").src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : defaultPoster; // Display the movie poster or the default poster if unavailable.
        document.getElementById("movie-overview").innerText = movie.overview; // Display the movie overview.
        document.getElementById("movie-rating").innerText = `Rating: ${movie.vote_average}`; // Display the movie rating.
        document.getElementById("movie-release-date").innerText = `Release Date: ${movie.release_date}`; // Display the movie release date.
    } catch (error) {
        console.error("Ошибка при получении данных о фильме:", error); // Log any error that occurs during the API fetch.
        document.getElementById("movie-overview").innerText = "Ошибка загрузки данных о фильме."; // Display an error message if the fetch fails.
    }
}

function goBack() { // Define a function to navigate back to the previous page.
    window.history.back(); // Go back to the previous page in the browser's history.
}

window.onload = () => { // Define a function to run when the page loads.
    if (movieId) { // Check if the movie ID is present in the URL.
        fetchMovieDetails(movieId); // Fetch and display movie details if the ID is available.
    } else {
        console.error("Movie ID is missing."); // Log an error if the movie ID is not in the URL.
    }
};
