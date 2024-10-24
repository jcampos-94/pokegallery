// Extra note due to the revert (delete later)

// Imports
import { getParams, fetchData, formatPokemonName, getPropertyString, getStatsList, getTypesAsImages } from "./utils.mjs";

// Define AbortController for future uses
let currentAbortController = null;

// Template for the Pokemon details
async function pokemonDetailsTemplate(entity, speciesData) {
    return `<section class="species">
        <h1 id="species-name">${formatPokemonName(entity.species.name)}</h1>
        <h1 id="species-number">Nº ${speciesData.id.toString().padStart(4,"0")}</h1>
    </section>
    <div class"pokemon-data">
        <section class="pokemon-form">
            <h2>${formatPokemonName(entity.name)}</h2>
            <img id="pokemon-img" src=${entity.sprites.other["official-artwork"].front_default}>
            <div class="types-images">${await getTypesAsImages(entity)}</div>
        </section>
        <section>
            <div class="pokemon-info">
                <p><b>Height:</b> ${entity.height / 10} m</p>
                <p><b>Weight:</b> ${entity.weight / 10} kg</p>
                <p><b>Abilities:</b> ${getPropertyString(entity, "abilities", "ability")}</p>
            </div>
            <div class="pokemon-stats">
                <p><b>Base Stats:</b>
                <ul>${getStatsList(entity)}</ul>
            </div>
        </section>
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
        const entityData = await pokemonDetailsTemplate(entity, species);
        detailsElement.innerHTML = entityData;

        } catch (error) {
            if (error.name === "AbortError") {
            console.log("Previous fetch aborted");
        } else {
            console.error("Error fetching Pokemon data:", error);
        }
    }
}