// Imports
import { formatPokemonName } from "./utils.mjs"

// Template for the Favorites card
function pokemonCardTemplate(entity) {
    return `<div class="pokemon-card" data-id="${entity.id}" data-form="${entity.form}">
        <div class="pokemon-card-inner">
            <!-- Front of the card -->
            <div class="pokemon-card-front">
                <h2>${formatPokemonName(entity.name)}</h2>
                <img src=${entity.sprite}>
            </div>
            <!-- Back of the card -->
            <div class="pokemon-card-back">
                <a href="../detailed/?id=${entity.id}&form=${entity.form}" class="details-btn">More Details</a>
                <button class="remove-btn">Remove</a>
            </div>
        </div>
    </div>`
}

// Function to render Pokémon cards from `localStorage`
export function renderFavoritePokemon() {
    const favoritesList = document.querySelector(".favorites-list");
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || []; // Array of favorite Pokémon objects

    // Prepare array to store all cards HTML
    const allCardsHtml = storedFavorites.map((entity) => {
        return pokemonCardTemplate(entity);
    });

    // Render all the cards
    favoritesList.innerHTML = allCardsHtml.join("");
}

// Function to initialize event listeners for removal
export function initializeRemoveButtons() {
    const favoritesList = document.querySelector(".favorites-list");

    favoritesList.addEventListener("click", (event) => {
        const removeButton = event.target.closest(".remove-btn");
        
        if (removeButton) {
            const card = removeButton.closest(".pokemon-card");
            const id = card.getAttribute("data-id");
            const form = card.getAttribute("data-form");

            // Add a fade-out effect before removal
            card.classList.add("fade-out");
            card.addEventListener("transitionend", () => {
                card.remove();
            });

            // Remove the Pokémon from localStorage
            removeFromLocalStorage(id, form);
        }
    });
}

// Function to remove Pokémon from localStorage
function removeFromLocalStorage(id, form) {
    let storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Filter out the specific Pokémon by matching both id and form
    storedFavorites = storedFavorites.filter(pokemon => {
        const match = pokemon.id === id && pokemon.form === form;
        return !match;
    });

    localStorage.setItem("favorites", JSON.stringify(storedFavorites));
}

// Favorites Event Listeners
export function favoritesEventListeners() {
    // Wait until the content is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Select the favorites list
    const cardContainer = document.querySelector(".favorites-list");
    
    // Attach click event to the parent container
    cardContainer.addEventListener("click", (event) => {
        const innerCard = event.target.closest(".pokemon-card-inner"); // Find the closest inner card clicked
        if (innerCard) {
            innerCard.classList.toggle("flipped"); // Toggle the flip class
        }
    });

    initializeRemoveButtons();
});
}