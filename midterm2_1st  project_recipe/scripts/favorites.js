function displayFavorites() { // Function to display favorite recipes stored in local storage.
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Retrieve favorites from local storage or set to empty array if null.
    const favoritesList = document.getElementById('favoritesList'); // Select the element to display the list of favorite recipes.
    const noFavorites = document.getElementById('noFavorites'); // Select the element to show when there are no favorites.

    if (favorites.length === 0) { // Check if there are no favorite recipes.
        noFavorites.style.display = 'block'; // Display the 'no favorites' message.
        favoritesList.innerHTML = ''; // Clear any existing content in the favorites list.
    } else {
        noFavorites.style.display = 'none'; // Hide the 'no favorites' message.
        favoritesList.innerHTML = ''; // Clear any existing content in the favorites list.

        favorites.forEach(recipe => { // Loop through each favorite recipe.
            const recipeCard = document.createElement('div'); // Create a div for each recipe card.
            recipeCard.classList.add('recipe-card'); // Add a CSS class to style the recipe card.
            recipeCard.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <button onclick="viewRecipe('${recipe.id}')">View Recipe</button>
                <button onclick="removeFromFavorites('${recipe.id}')">Remove from Favorites</button>
            `; // Set the inner HTML to display the image, title, and buttons for viewing or removing the recipe.
            favoritesList.appendChild(recipeCard); // Add the recipe card to the favorites list.
        });
    }
}

window.onload = displayFavorites; // Call displayFavorites when the page loads to show any stored favorites.

function viewRecipe(recipeId) { // Function to view a recipe's details.
    window.location.href = `recipe.html?recipeId=${recipeId}`; // Redirect to the recipe details page with the recipe ID in the URL.
}

function removeFromFavorites(recipeId) { // Function to remove a recipe from favorites.
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Retrieve favorites from local storage or set to empty array if null.

    favorites = favorites.filter(recipe => recipe.id !== recipeId); // Filter out the recipe with the specified ID.

    localStorage.setItem('favorites', JSON.stringify(favorites)); // Update local storage with the new favorites list.

    displayFavorites(); // Refresh the display of favorite recipes.
}

function setActiveLink() { // Function to highlight the active navigation link based on the current page.
    const currentPage = window.location.pathname.split("/").pop(); // Get the current page file name.
    const links = document.querySelectorAll("nav a"); // Select all navigation links.

    links.forEach(link => link.classList.remove("active")); // Remove the 'active' class from all links.

    if (currentPage === "index.html") { // If on the index page...
        document.getElementById("searchLink").classList.add("active"); // Highlight the search link.
    } else if (currentPage === "popular.html") { // If on the popular page...
        document.getElementById("popularLink").classList.add("active"); // Highlight the popular link.
    } else if (currentPage === "categories.html") { // If on the categories page...
        document.getElementById("categoriesLink").classList.add("active"); // Highlight the categories link.
    } else if (currentPage === "favorites.html") { // If on the favorites page...
        document.getElementById("favoritesLink").classList.add("active"); // Highlight the favorites link.
    }
}

setActiveLink(); // Call setActiveLink to set the initial active link when the page loads.
