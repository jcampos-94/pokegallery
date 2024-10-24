// Imports
import { getParams, fetchData, formatPokemonName } from "./utils.mjs";

// Define AbortController for future uses
let currentAbortController = null;

// Template for the Pokemon details
function pokemonDetailsTemplate(entity) {
    return `<div class="pokemon">
        <h2>${formatPokemonName(entity.species.name)}</h2>
        <img src=${entity.sprites.other["official-artwork"].front_default}>
    </div>`
}

// Render data based on ID parameter
export async function renderDetailsWithTemplate() {
    // Get pokemon-details element from detailed/index.html
    let detailsElement = document.querySelector(".pokemon-details");


    // Create a new AbortController for the current fetch
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;
    
    try {
        // Get ID
        const id = getParams("id");
        
        // Get species Data
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
        const species = await fetchData(speciesUrl, signal);

        //Get Form
        const form = getParams("form");
        
        // Get entity Data
        const entityUrl = `${species.varieties[form].pokemon.url}`;
        const entity = await fetchData(entityUrl, signal);
        const entityData = pokemonDetailsTemplate(entity);
        detailsElement.innerHTML = entityData;

        } catch (error) {
            if (error.name === "AbortError") {
            console.log("Previous fetch aborted");
        } else {
            console.error("Error fetching Pokemon data:", error);
        }
    }
}