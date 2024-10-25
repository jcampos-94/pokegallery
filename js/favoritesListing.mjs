// Imports
import { formatPokemonName } from "./utils.mjs"

// Template for the Favorites card
function pokemonCardTemplate(entity) {
    return `<div class="pokemon-card">
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