// Fetch Data
export async function fetchData(api) {
    let response = await fetch(api);
    if (response.ok) {
        let data = await response.json();
        return data;
    } else {
        console.error("Error fetching data:", response.status, response.statusText);
        const text = await response.text(); // Get the response body as text
        console.log("Response body:", text); // Log the response body
        throw new Error(`Error fetching data: ${response.status}`);
    }
}

export async function getEntitiesData() {
    // Get a list with every pokemon entity
    const listUrl = "https://pokeapi.co/api/v2/pokedex/1";
    const entititesList = await fetchData(listUrl);

    // Loop through each entities and fetch additional data
    const entitiesUrl = "https://pokeapi.co/api/v2/pokemon/";

    let entitiesArray = []
    
    for (let entity of entititesList.pokemon_entries) {
        const url = entitiesUrl + entity.entry_number;
        console.log("Fetching:", url);

        try {
            let entitiesData = await fetchData(url);
            entitiesArray.push(entitiesData);
            console.log(entity)
        } catch(error) {
            console.error("Error fetching entity data:", error, "for URL:", url)
        }
    }

    return entitiesArray;
}