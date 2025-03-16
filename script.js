// DOM Elements
const cocktailNameInput = document.getElementById('cocktail-name');
const ingredientNameInput = document.getElementById('ingredient-name');
const searchBtn = document.getElementById('search-btn');
const filterBtn = document.getElementById('filter-btn');
const randomBtn = document.getElementById('random-btn');
const cocktailDetails = document.getElementById('cocktail-details');
const cocktailsGrid = document.getElementById('cocktails-grid');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const cocktailTitle = document.getElementById('cocktail-title');
const cocktailImg = document.getElementById('cocktail-img');
const category = document.getElementById('category');
const glass = document.getElementById('glass');
const alcoholic = document.getElementById('alcoholic');
const ingredientsList = document.getElementById('ingredients-list');
const instructions = document.getElementById('instructions');
const gridItems = document.getElementById('grid-items');

// API Base URL
const API_BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

// Event Listeners
searchBtn.addEventListener('click', searchCocktailByName);
filterBtn.addEventListener('click', filterByIngredient);
randomBtn.addEventListener('click', getRandomCocktail);
cocktailNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchCocktailByName();
});
ingredientNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') filterByIngredient();
});

// Show loading state
function showLoading() {
    hideAll();
    loading.classList.remove('hidden');
}

// Hide all content containers
function hideAll() {
    cocktailDetails.classList.add('hidden');
    cocktailsGrid.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loading.classList.add('hidden');
}

// Display error message
function showError() {
    hideAll();
    errorMessage.classList.remove('hidden');
}

// Fetch data from API
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(API_BASE_URL + endpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        showError();
        return null;
    }
}

// Search cocktail by name
async function searchCocktailByName() {
    const cocktailName = cocktailNameInput.value.trim();
    if (!cocktailName) return;
    
    showLoading();
    
    const data = await fetchFromAPI(`search.php?s=${encodeURIComponent(cocktailName)}`);
    
    if (data && data.drinks && data.drinks.length > 0) {
        displayCocktailsGrid(data.drinks);
    } else {
        showError();
    }
}

// Filter by ingredient
async function filterByIngredient() {
    const ingredientName = ingredientNameInput.value.trim();
    if (!ingredientName) return;
    
    showLoading();
    
    const data = await fetchFromAPI(`filter.php?i=${encodeURIComponent(ingredientName)}`);
    
    if (data && data.drinks && data.drinks.length > 0) {
        displayCocktailsGrid(data.drinks);
    } else {
        showError();
    }
}

// Get random cocktail
async function getRandomCocktail() {
    showLoading();
    
    const data = await fetchFromAPI('random.php');
    
    if (data && data.drinks && data.drinks.length > 0) {
        displayCocktailDetails(data.drinks[0]);
    } else {
        showError();
    }
}

// Display cocktails grid
function displayCocktailsGrid(drinks) {
    hideAll();
    
    gridItems.innerHTML = '';
    
    drinks.forEach(drink => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.innerHTML = `
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
            <div class="grid-item-info">
                <h3>${drink.strDrink}</h3>
            </div>
        `;
        
        gridItem.addEventListener('click', async () => {
            showLoading();
            
            // If we have full drink details already, use them
            if (drink.strInstructions) {
                displayCocktailDetails(drink);
            } else {
                // Otherwise fetch full details
                const data = await fetchFromAPI(`lookup.php?i=${drink.idDrink}`);
                
                if (data && data.drinks && data.drinks.length > 0) {
                    displayCocktailDetails(data.drinks[0]);
                } else {
                    showError();
                }
            }
        });
        
        gridItems.appendChild(gridItem);
    });
    
    cocktailsGrid.classList.remove('hidden');
}

// Display cocktail details
function displayCocktailDetails(drink) {
    hideAll();
    
    cocktailTitle.textContent = drink.strDrink;
    cocktailImg.src = drink.strDrinkThumb;
    category.textContent = drink.strCategory || 'N/A';
    glass.textContent = drink.strGlass || 'N/A';
    alcoholic.textContent = drink.strAlcoholic || 'N/A';
    instructions.textContent = drink.strInstructions || 'No instructions available.';
    
    // Clear ingredients list
    ingredientsList.innerHTML = '';
    
    // Add ingredients and measurements
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = measure ? `${measure} ${ingredient}` : ingredient;
            ingredientsList.appendChild(listItem);
        }
    }
    
    cocktailDetails.classList.remove('hidden');
}

// Initialize with a random cocktail
getRandomCocktail();
