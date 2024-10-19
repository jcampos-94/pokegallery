import { fetchData } from "./utils.mjs";

function pokemonListTemplate(entities) {
    return `<div>
    <h2>${entities.id}. ${entities.species.name}</h2>
    <img src=${entities.sprites.other["official-artwork"].front_default}>
    </div>`
}

export async function renderListWithTemplate() {
    
    // Get pokemon-list element from index.html
    let listElement = document.querySelector(".pokemon-list")
    
    //Get all pokemon ID's
    const listUrl = "https://pokeapi.co/api/v2/pokedex/1";
    const entitiesList = await fetchData(listUrl);

    // Sort Pokémon list by ID
    entitiesList.pokemon_entries.sort((a, b) => a.entry_number - b.entry_number);
    
    // Process each entity in small batches
    const batchSize = 10;

    for (let i = 0; i < entitiesList.pokemon_entries.length; i += batchSize) {
        const batch = entitiesList.pokemon_entries.slice(i, i + batchSize);

        // Fetch and render one pokemon at a time
        await fetchAndRenderBatch(listElement, batch);
        }
    };

async function fetchAndRenderBatch(listElement, batch) {
    // Use en entity from the list to get data on the Pokemon
    const entitiesUrl = "https://pokeapi.co/api/v2/pokemon/";
    const batchData = [];

    // Fetch each entity's data in the current batch
    for (let entity of batch) {
        const url = entitiesUrl + entity.entry_number
        
        try {
            let entityData = await fetchData(url);
            batchData.push(entityData)
        } catch (error) {
            console.error("Error fetching entity data:", error, "for URL:", url);
        }
        
    }
    // Sort the batch by Pokémon ID to ensure order within each batch before rendering
    batchData.sort((a, b) => a.id - b.id);
    
    // Render the sorted batch
    batchData.forEach(entity => {
        let card = pokemonListTemplate(entity);
        listElement.innerHTML += card; // Render each pokemon inmediately after getting its data
    })
}