const apiKey = 'ae630de820bb4b6188a2d67fd9cf3ce4'; // Define the API key for accessing the Spoonacular API.

async function loadRecipe(recipeId) { // Define an asynchronous function to load recipe details by ID.
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`); // Fetch detailed recipe information from the Spoonacular API using the recipe ID.
    const recipe = await response.json(); // Parse the JSON response to get the recipe details.

    document.getElementById('recipeTitle').innerText = recipe.title; // Set the recipe title in the DOM.
    document.getElementById('recipeImage').src = recipe.image; // Set the recipe image source in the DOM.
    
    const ingredientsList = document.getElementById('ingredientsList'); // Select the element to display the list of ingredients.
    ingredientsList.innerHTML = ''; // Clear any existing content in the ingredients list.
    recipe.extendedIngredients.forEach(ingredient => { // Loop through each ingredient in the recipe.
        const li = document.createElement('li'); // Create a list item element for each ingredient.
        li.innerText = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`; // Set the text to display the amount, unit, and name of the ingredient.
        ingredientsList.appendChild(li); // Append the list item to the ingredients list.
    });

    document.getElementById('instructions').innerText = recipe.instructions; // Set the recipe instructions in the DOM.
    document.getElementById('nutritionInfo').innerText = `Calories: ${recipe.nutrition.nutrients[0].amount} kcal`; // Display the calories in the nutrition info section.

    checkIfFavorite(recipeId); // Check if the recipe is already in the favorites list.
}

function checkIfFavorite(recipeId) { // Define a function to check if a recipe is in the favorites list.
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Retrieve favorites from local storage or set to an empty array if null.
    const isFavorite = favorites.some(recipe => recipe.id === recipeId); // Check if the recipe ID exists in the favorites list.

    const favoriteButton = document.getElementById('favoriteButton'); // Select the favorite button element.

    if (isFavorite) { // If the recipe is in the favorites list...
        favoriteButton.innerText = 'Already in Favorites'; // Update the button text.
        favoriteButton.disabled = true; // Disable the button to prevent adding it again.
    } else { // If the recipe is not in the favorites list...
        favoriteButton.innerText = 'Add to Favorites'; // Update the button text.
        favoriteButton.disabled = false; // Enable the button for adding to favorites.
    }
}

function addToFavorites() { // Define a function to add the recipe to the favorites list.
    const recipeId = new URLSearchParams(window.location.search).get('recipeId'); // Retrieve the recipe ID from the URL query parameter.
    const recipeTitle = document.getElementById('recipeTitle').innerText; // Get the recipe title from the DOM.
    const recipeImage = document.getElementById('recipeImage').src; // Get the recipe image source from the DOM.

    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Retrieve favorites from local storage or set to an empty array if null.

    if (!favorites.some(recipe => recipe.id === recipeId)) { // If the recipe is not already in the favorites list...
        favorites.push({
            id: recipeId,
            title: recipeTitle,
            image: recipeImage
        }); // Add the recipe details to the favorites array.

        localStorage.setItem('favorites', JSON.stringify(favorites)); // Save the updated favorites list to local storage.

        alert('Recipe added to favorites!'); // Alert the user that the recipe was added.
        
        checkIfFavorite(recipeId); // Check again to update the favorite button status.
    } else {
        alert('This recipe is already in favorites!'); // Alert the user if the recipe is already in favorites.
    }
}

function goBack() { // Define a function to navigate back to the previous page.
    window.history.back(); // Go back to the previous page in the browser's history.
}

const urlParams = new URLSearchParams(window.location.search); // Create a URLSearchParams object to access query parameters.
const recipeId = urlParams.get('recipeId'); // Get the 'recipeId' parameter from the URL.

if (recipeId) { // If a recipe ID is provided in the URL...
    loadRecipe(recipeId); // Call loadRecipe to display the recipe details.
}
