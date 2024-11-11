const apiKey = 'ae630de820bb4b6188a2d67fd9cf3ce4'; // Define the API key for accessing the Spoonacular API.

async function loadCategory(category) { // Define an asynchronous function to load recipes based on a specific category.
    document.getElementById('mainCategoryTitle').style.display = 'none'; // Hide the main category title initially.
    document.getElementById('categoryCards').style.display = 'none'; // Hide the category cards.

    const categoryTitle = document.getElementById("categoryTitle"); // Select the HTML element for the category title.
    categoryTitle.innerText = category.toUpperCase(); // Set the text of the category title to uppercase.
    categoryTitle.style.display = "block"; // Display the category title.

    document.getElementById("loading").style.display = "block"; // Show the loading spinner to indicate data loading.

    try {
        // Fetch recipes from the Spoonacular API for the specified category, limiting results to 10.
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?type=${category}&number=10&apiKey=${apiKey}`);
        
        if (!response.ok) { // Check if the response from the API is unsuccessful.
            throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the API response is not OK.
        }

        const data = await response.json(); // Parse the JSON data returned from the API.
        
        displayRecipes(data.results, document.getElementById('recipeList')); // Call displayRecipes to render the recipe cards in the recipe list container.

        document.getElementById('recipeList').style.display = 'grid'; // Display the recipe list in a grid layout.
        document.getElementById('backButton').style.display = 'block'; // Show the back button.
    } catch (error) {
        console.error('Error loading recipes:', error); // Log any error that occurs during the API fetch.
        alert('An error occurred while loading recipes. Please try again.'); // Alert the user if an error occurs.
    } finally {
        document.getElementById("loading").style.display = "none"; // Hide the loading spinner after the API call is complete, whether successful or not.
    }
}

function displayRecipes(recipes, recipeList) { // Define a function to display recipes on the page.
    recipeList.innerHTML = ''; // Clear any existing content in the recipe list.
    recipes.forEach(recipe => { // Loop through each recipe in the recipes array.
        const recipeCard = document.createElement('div'); // Create a div element for each recipe card.
        recipeCard.classList.add('recipe-card'); // Add a CSS class to style the recipe card.

        recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <button onclick="viewRecipe(${recipe.id})">View Recipe</button>
    `;
    
        recipeList.appendChild(recipeCard); // Append each recipe card to the recipe list element.
    });
}

function viewRecipe(recipeId) { // Define a function to navigate to the recipe's page.
    window.location.href = `recipe.html?recipeId=${recipeId}`; // Redirect to the recipe details page with its ID as a query parameter.
}

function showCategories() { // Define a function to show the main category selection screen.
    document.getElementById('recipeList').style.display = 'none'; // Hide the recipe list.
    document.getElementById('categoryCards').style.display = 'flex'; // Show the category cards.
    document.getElementById('backButton').style.display = 'none'; // Hide the back button.
    
    document.getElementById('mainCategoryTitle').style.display = 'block'; // Display the main category title.
    document.getElementById('categoryTitle').style.display = 'none'; // Hide the specific category title.
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
