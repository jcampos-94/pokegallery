import { renderCardWithTemplate } from "./pokemonListing.mjs";

// Select the Region dropdown
const regionDropdown = document.querySelector("#selectRegion");

// Add event listener for the region selection dropdown
regionDropdown.addEventListener("change", (event) => {
    const selectedRegion = event.target.value;

    // Reder the list
    if (selectedRegion) {
        renderCardWithTemplate(selectedRegion)
    }
});

// Select all the Pokemon cards
document.addEventListener('DOMContentLoaded', () => {
    // Attach click event to the parent container
    const cardContainer = document.querySelector('.pokemon-list'); // Adjust this selector based on your HTML structure

    cardContainer.addEventListener('click', (event) => {
        const innerCard = event.target.closest('.pokemon-card-inner'); // Find the closest inner card clicked
        if (innerCard) {
            innerCard.classList.toggle('flipped'); // Toggle the flip class
        }
    });
});