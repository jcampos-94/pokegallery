// Fetch Data
async function fetchData(api) {
    let response = await fetch(api);
    if (response.ok) {
        let data = await response.json();
        return data;
    }
}

export async function getSpeciesData() {
    // Get a list with every pokemon species
    const listUrl = "https://pokeapi.co/api/v2/pokedex/1";
    const speciesList = await fetchData(listUrl);  // Await the fetch to get the actual data

    // Loop through each species and fetch additional data
    const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/";

    speciesList.pokemon_entries.forEach(async (species) => {
        let speciesData = await fetchData(speciesUrl + species.entry_number);
        console.log(`${speciesData.id}. ${speciesData.name}`);
        return speciesData;
    });
}