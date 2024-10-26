import { renderFavoritePokemon, initializeRemoveButtons } from "./favoritesListing.mjs";

// Render favorites
renderFavoritePokemon();

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