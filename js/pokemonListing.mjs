import { fetchData, sortPokemonById, filterByRegion, formatPokemonName, getPropertyString, getTotalBaseStats } from "./utils.mjs";

// Define AbortController for future uses
let currentAbortController = null;

// Pokemon IDs belonging to their first region
const regionIdRanges = {
    "Kanto": { min: 1, max: 151 },
    "Johto": { min: 152, max: 251 },
    "Hoenn": { min: 252, max: 386 },
    "Sinnoh": { min: 387, max: 493 },
    "Unova": { min: 494, max: 649 },
    "Kalos": { min: 650, max: 721 },
    "Alola": { min: 722, max: 809 },
    "Galar": { min: 810, max: 898 },
    "Hisui": { min: 899, max: 905 },
    "Paldea": { min: 906, max: 1025 }, // Adjust range for Paldea based on the latest information
    // Add more regions based on the latest information
};

// Template for the Pokemon card
function pokemonCardTemplate(entities) {
    return `<div class="pokemon-card">
        <div class="pokemon-card-inner">
            <!-- Front of the card -->
            <div class="pokemon-card-front">
                <h2>${formatPokemonName(entities.species.name)}</h2>
                <img src=https://resource.pokemon-home.com/battledata/img/pokei128/icon${entities.id.toString().padStart(4,"0")}_f00_s0.png>
            </div>
            <!-- Back of the card -->
            <div class="pokemon-card-back">
                <p><b>Types:</b> ${getPropertyString(entities, "types", "type")}</p>
                <p><b>Abilities:</b> ${getPropertyString(entities, "abilities", "ability")}</p>
                <p><b>Base Stats:</b> ${getTotalBaseStats(entities)}</p>
                <a href="detailed/?id=${entities.id}&form=0" class="details-btn">More Details</a>
            </div>
        </div>
    </div>`
}

// Fetch and render a batch of Pokemon
async function fetchAndRenderBatch(listElement, entitiesBatch, signal) {
    // Use en entity from the list to get data on the Pokemon
    const entitiesUrl = "https://pokeapi.co/api/v2/pokemon/";
    const batchData = [];

    // Fetch each entity's data in the current batch
    for (let entity of entitiesBatch) {
        // Stop processing if aborted
        if (signal.aborted) {
            console.log("Fetch aborted. Stopping further rendering.");
            return;
        }

        const url = entitiesUrl + entity.entry_number
        
        try {
            let entityData = await fetchData(url, signal);
            batchData.push(entityData)
        } catch (error) {
            // Stop processing if aborted
            if (error.name == "AbortError") {
                console.log("Fetch aborted for", url);
                return
            }
            console.error("Error fetching entity data:", error, "for URL:", url);
        }
        
    }

    // Sort batch by Pokémon ID to ensure order within each batch before rendering
    batchData.sort((a, b) => a.id - b.id);
    
    // Render the sorted batch
    batchData.forEach(entity => {
        // Check if signal was not aborted before rendering
        if (!signal.aborted) {
            let card = pokemonCardTemplate(entity);
            listElement.innerHTML += card; // Render each Pokemon inmediately after getting its data
        }
    })
}

// Handle region selection and rendering
export async function renderCardWithTemplate(region) {
    // Get pokemon-list element from index.html
    let listElement = document.querySelector(".pokemon-list");

    // Abort the previous fetch if it is still running
    if (currentAbortController) {
        currentAbortController.abort();  // Abort ongoing requests
    }

    // Clear the previous list
    listElement.innerHTML = '';

    // Create a new AbortController for the current fetch
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;
    
    try {
        //Get all Pokemon entities
        const listUrl = "https://pokeapi.co/api/v2/pokedex/1";
        const entitiesList = await fetchData(listUrl, signal);
    
        // Sort Pokemon list by entry number (ID)
        const sortedEntries = sortPokemonById(entitiesList.pokemon_entries);
    
        // Filter Pokemon entries based on the selected region
        const filteredPokemonEntries = filterByRegion(sortedEntries, regionIdRanges, region);
        
        // Process each entity in small batches
        const batchSize = 10;
    
        for (let i = 0; i < filteredPokemonEntries.length; i += batchSize) {
            const batch = filteredPokemonEntries.slice(i, i + batchSize);
    
            // Fetch and render one Pokemon at a time
            await fetchAndRenderBatch(listElement, batch, signal);
            }
        } catch (error) {
            if (error.name === "AbortError") {
            console.log("Previous fetch aborted");
        } else {
            console.error("Error fetching Pokemon data:", error);
        }
    }
}

// Main site event listeners
export function loadMainEventListeners() {
    // Select the Region dropdown
const regionDropdown = document.querySelector("#selectRegion");

// Add event listener for the region selection dropdown
regionDropdown.addEventListener("change", (event) => {
    const selectedRegion = event.target.value;

    // Render the list
    if (selectedRegion) {
        renderCardWithTemplate(selectedRegion)
    }
});

// Wait until the content is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Select the pokemon list
    const cardContainer = document.querySelector(".pokemon-list");
    
    // Attach click event to the parent container
    cardContainer.addEventListener("click", (event) => {
        const innerCard = event.target.closest(".pokemon-card-inner"); // Find the closest inner card clicked
        if (innerCard) {
            innerCard.classList.toggle("flipped"); // Toggle the flip class
        }
    });
});
}