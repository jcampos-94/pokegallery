// Imports
import { getParams, fetchData, formatPokemonName, getPropertyString, getStatsList, getTypesAsImages, getAbilitiesAsButtons } from "./utils.mjs";

// Define AbortController for future uses
let currentAbortController = null;

// Template for the Pokemon details
async function pokemonDetailsTemplate(entity, speciesData) {
    return `<section class="species">
        <h1 id="species-name">${formatPokemonName(entity.species.name)}</h1>
        <h1 id="species-number">Nº ${speciesData.id.toString().padStart(4,"0")}</h1>
    </section>
    <div class="pokemon-data">
        <section class="pokemon-form">
            <h2>${formatPokemonName(entity.name)}</h2>
            <img id="pokemon-img" src=${entity.sprites.other["official-artwork"].front_default} alt="${entity.name}">
            <div class="types-images">${await getTypesAsImages(entity)}</div>
        </section>
        <section class="pokemon-details-right">
            <div class="pokemon-info">
                <p><b>Height:</b> ${entity.height / 10} m</p>
                <p><b>Weight:</b> ${entity.weight / 10} kg</p>
                <p><b>Abilities:</b> ${getAbilitiesAsButtons(entity)}</p>
                <div id="ability-description" class="ability-description hidden">
                    <div class="close-btn">CLOSE</div>
                    <div id="ability-content"></div>
                </div>
            </div>
            <div class="pokemon-stats">
                <p><b>Base Stats:</b>
                <ul>${getStatsList(entity)}</ul>
            </div>
        </section>
    </div>
    <section id="available-forms">
        <h2>Available Forms<h2>
        <div class="available-forms">${await getFormsData(speciesData)}</div>
    </section>
    <section>
        <button class="add-fav-btn">Add to Favorites</button>
    </section>`
}

// Template for the Available Forms
function pokemonFormsTemplate(entity, index, speciesData) {
    return `<div class="form-card">
            <a href="?id=${speciesData.id}&form=${index}"><img src=${entity.sprites.other["official-artwork"].front_default} alt="${entity.name}"></a>
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

// Render Forms data
async function getFormsData(speciesData) {
    const formsHtml = [];

    // Loop through each variety (form) in speciesData
    for (let index = 0; index < speciesData.varieties.length; index++) {
        const variety = speciesData.varieties[index];
        const formUrl = variety.pokemon.url;

        try {
            // Fetch the form data
            const entity = await fetchData(formUrl);
            
            // Generate HTML using the template and form data
            const formHtml = pokemonFormsTemplate(entity, index, speciesData);
            
            // Store the form HTML
            formsHtml.push(formHtml);
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    }

    // Return all the forms' HTML as a joined string
    return formsHtml.join("");
}

// Function to open the ability description with the correct content
async function openAbilityDescription(abilityButton) {
    const descriptionDiv = document.getElementById("ability-description");
    const abilityContent = document.getElementById("ability-content");

    // Get the URL from the clicked ability button
    const abilityUrl = abilityButton.getAttribute("data-url");

    try {
        // Fetch the ability data
        const abilityData = await fetchData(abilityUrl);

        // Find the first entry in English
        const englishEntry = abilityData.flavor_text_entries.find(entry => entry.language.name === "en");

        // Render the Description
        abilityContent.innerHTML = `<h3>${abilityButton.textContent}</h3><p>${englishEntry.flavor_text}</p>`;
        descriptionDiv.classList.remove("hidden");
        
        // Animate the description pop-up from the bottom
        setTimeout(() => {
            descriptionDiv.style.bottom = "0";
        }, 10);
    } catch(error) {
        console.error("Error fetching ability data:", error);
    }
    
}

// Function to close the ability description
function closeAbilityDescription() {
    const descriptionDiv = document.getElementById("ability-description");
    
    // Animate back to the bottom and hide after the animation
    descriptionDiv.style.bottom = "-100%";
    setTimeout(() => {
        descriptionDiv.classList.add("hidden");
    }, 500);
}

export function loadDetailsEventListeners() {
    // Add Event listeners on the site
    document.addEventListener("DOMContentLoaded", () => {
        // Select the parent container of the abilities
        const pokemonInfo = document.querySelector(".pokemon-details");
        
        // Attach click event listener to the parent container
        pokemonInfo.addEventListener("click", (event) => {
            // Check if the clicked target is an ability button
            const abilityButton = event.target.closest(".ability-button");
            if (abilityButton) {
                // Trigger the display of the hidden description div
                openAbilityDescription(abilityButton);
            }

            // Check if the clicked target is a CLOSE button
            const closeButton = event.target.closest(".close-btn");
            if (closeButton) {
                // Trigger the display of the hidden description div
                closeAbilityDescription(closeButton);
            }

            // Check if the clicked target is the Add to Favorites button
            const addButton = event.target.closest(".add-fav-btn");
            if (addButton) {
                // Trigger the display of the hidden description div
                addToFavorites();
            }
        });
    });
}

// Function to save Pokémon details to localStorage
async function addToFavorites() {
    const id = getParams('id');
    const form = getParams('form');
    
    try {
        // Fetch Pokémon species data
        const speciesData = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        
        // Access the correct form URL and fetch form data
        const formUrl = speciesData.varieties[form].pokemon.url;
        const formData = await fetchData(formUrl);
        
        // Prepare data to be stored
        const pokemonData = {
            id: id,
            form: form,
            name: formData.name,
            sprite: formData.sprites.other["official-artwork"].front_default
        };
        
        // Retrieve current favorites from localStorage or initialize an empty array
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // Add the new Pokémon if it’s not already in favorites
        if (!favorites.find(pokemon => pokemon.id === id && pokemon.form === form)) {
            favorites.push(pokemonData);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${formatPokemonName(pokemonData.name)} added to Favorites!`);
        } else {
            alert(`${formatPokemonName(pokemonData.name)} is already in Favorites.`);
        }
    } catch (error) {
        console.error("Failed to add to favorites:", error);
    }
}