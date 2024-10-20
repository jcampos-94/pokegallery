import { renderListWithTemplate } from "./pokemonListing.mjs";

// Add event listener for the region selection dropdown

const regionDropdown = document.querySelector("#selectRegion");

regionDropdown.addEventListener("change", (event) => {
    const selectedRegion = event.target.value;

    // Reder the list
    if (selectedRegion) {
        renderListWithTemplate(selectedRegion)
    }
});
