const apiKey = 'ae630de820bb4b6188a2d67fd9cf3ce4'; // Define the API key for accessing the Spoonacular API.

async function searchRecipes() { // Define an asynchronous function to search recipes based on a user query.
    const query = document.getElementById('searchInput').value; // Get the search input value from the input field.

    if (!query.trim()) { // Check if the query is empty or contains only whitespace.
        alert("Please enter a recipe name!"); // Alert the user if the input is empty.
        return; // Exit the function if there’s no input.
    }

    document.getElementById("loading").style.display = "block"; // Show the loading spinner to indicate data loading.

    try {
        // Fetch search results from the Spoonacular API for the given query, limiting to 10 results.
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`);
        
        if (!response.ok) { // Check if the response from the API is unsuccessful.
            throw new Error(`Error: ${response.status}`); // Throw an error if the API response is not OK.
        }

        const data = await response.json(); // Parse the JSON data returned from the API.

        document.getElementById("loading").style.display = "none"; // Hide the loading spinner.
        displayRecipes(data.results, document.getElementById('recipeList')); // Display the search results using the displayRecipes function.

    } catch (error) {
        console.error('Error loading recipes:', error); // Log any error that occurs during the API fetch.
        alert('An error occurred while loading recipes. Please try again.'); // Alert the user if an error occurs.
        document.getElementById("loading").style.display = "none"; // Hide the loading spinner if an error occurs.
    }
}

function displayRecipes(recipes, recipeList) { // Define a function to display recipes on the page.
    recipeList.innerHTML = ''; // Clear any existing content in the recipe list.

    if (recipes.length === 0) { // Check if there are no recipes returned.
        recipeList.innerHTML = '<p class="no-recipes">Recipe not found</p>'; // Display a message if no recipes were found.
        return; // Exit the function if no recipes were found.
    }

    recipes.forEach(recipe => { // Loop through each recipe in the recipes array.
        const recipeCard = document.createElement('div'); // Create a div element for each recipe card.
        recipeCard.classList.add('recipe-card'); // Add a CSS class to style the recipe card.

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button onclick="viewRecipe(${recipe.id})">View Recipe</button>
        `; // Set the inner HTML to display the image, title, and a button to view the recipe.
        recipeList.appendChild(recipeCard); // Append each recipe card to the recipe list element.
    });
}

async function loadPopularRecipes() { // Define an asynchronous function to load popular recipes.
    document.getElementById("loading").style.display = "block"; // Show the loading spinner to indicate data loading.

    try {
        // Fetch a list of random popular recipes from the Spoonacular API, limited to 12 results.
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=12&apiKey=${apiKey}`);
        
        if (!response.ok) { // Check if the response from the API is unsuccessful.
            throw new Error(`Error: ${response.status}`); // Throw an error if the API response is not OK.
        }

        const data = await response.json(); // Parse the JSON data returned from the API.

        document.getElementById("loading").style.display = "none"; // Hide the loading spinner.
        document.getElementById("popularRecipes").style.display = "block"; // Show the popular recipes section.
        
        displayRecipes(data.recipes, document.getElementById('popularRecipesContainer')); // Display the popular recipes using displayRecipes function.

    } catch (error) {
        console.error('Error loading popular recipes:', error); // Log any error that occurs during the API fetch.
        alert('An error occurred while loading popular recipes. Please try again.'); // Alert the user if an error occurs.
        document.getElementById("loading").style.display = "none"; // Hide the loading spinner if an error occurs.
    }
}

async function loadCategory(category) { // Define an asynchronous function to load recipes by category.
    document.getElementById("loading").style.display = "block"; // Show the loading spinner to indicate data loading.

    try {
        // Fetch recipes from the Spoonacular API based on the category, limited to 10 results.
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?type=${category}&number=10&apiKey=${apiKey}`);
        
        if (!response.ok) { // Check if the response from the API is unsuccessful.
            throw new Error(`Error: ${response.status}`); // Throw an error if the API response is not OK.
        }

        const data = await response.json(); // Parse the JSON data returned from the API.

        document.getElementById("loading").style.display = "none"; // Hide the loading spinner.
        displayRecipes(data.results, document.getElementById('recipeList')); // Display the recipes based on the category using displayRecipes function.

    } catch (error) {
        console.error('Error loading recipes by category:', error); // Log any error that occurs during the API fetch.
        alert('An error occurred while loading recipes. Please try again.'); // Alert the user if an error occurs.
        document.getElementById("loading").style.display = "none"; // Hide the loading spinner if an error occurs.
    }
}

function viewRecipe(recipeId) { // Define a function to navigate to the recipe's page.
    window.location.href = `recipe.html?recipeId=${recipeId}`; // Redirect to the recipe details page with its ID as a query parameter.
}

function setActiveLink() { // Define a function to highlight the active navigation link based on the current page.
    const currentPage = window.location.pathname.split("/").pop(); // Get the current page file name from the URL.
    const links = document.querySelectorAll("nav a"); // Select all navigation links.

    links.forEach(link => link.classList.remove("active")); // Remove the 'active' class from all links to reset.

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
