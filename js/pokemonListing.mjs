import { getEntitiesData } from "./utils.mjs";

function pokemonListTemplate(entities) {
    return `<div>
    <h2>${entities.id}. ${entities.species.name}</h2>
    <img src=${entities.sprites.other["official-artwork"].front_default}>
    </div>`
}

export async function renderListWithTemplate() {
    
    // Get pokemon list from index
    let listElement = document.querySelector(".pokemon-list")
    
    // Iterate entities data and render
    let entitiesList = (await getEntitiesData());
    console.log(entitiesList);
    
    entitiesList.forEach(entity => {
        let card = pokemonListTemplate(entity);
        listElement.innerHTML += card;
    });
}