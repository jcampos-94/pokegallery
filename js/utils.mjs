// Fetch Data with signal for AbortController
export async function fetchData(api, signal) {
    let response = await fetch(api, { signal });
    if (response.ok) {
        let data = await response.json();
        return data;
    }
}

// Sort Pokemon entries by ID
export function sortPokemonById(entries) {
    return entries.sort((a, b) => a.entry_number - b.entry_number);
}

// Filter Pokemon entries based on region
export function filterByRegion(entries, regionIdRanges, region) {
    const { min, max } = regionIdRanges[region];
    return entries.filter(entry => 
        entry.entry_number >= min && entry.entry_number <= max
    );
}

// Format Pokemon names
export function formatPokemonName(name) {
    // Special cases for Nidoran
    if (name === "nidoran-f") {
        return "Nidoran <span class='material-symbols-outlined'>female</span>"; // Female symbol
    }
    if (name === "nidoran-m") {
        return "Nidoran <span class='material-symbols-outlined'>male</span>"; // Male symbol
    }

    // Special cases for the Jagnmo-o line
    if (name === "jangmo-o") {
        return "Jangmo-o";
    }
    if (name === "hakamo-o") {
        return "Hakamo-o";
    }
    if (name === "kommo-o") {
        return "Kommo-o";
    }

    // Special case for Ho-Oh
    if (name === "ho-oh") {
        return "Ho-Oh";
    }

    // Capitalize first letter of each word and replace hyphens with spaces
    return name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// General function to return a comma separated list
// from an array extracted from the API
export function getPropertyString(entities, property, key) {
    return entities[property].map(item => item[key].name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")).join(', ');
}

// Return stats as <li> elements
// from an array extracted from the API
export function getStatsList(entity) {
    return entity["stats"].map(item => 
        `<li><b>${item["stat"].name.split("-").map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ")}:</b> ${item.base_stat}</li>`
    ).join(''); // Joining without separator so it returns a string of <li> elements
}

// Return types as images
export async function getTypesAsImages(entity) {
    const typeImages = await Promise.all(
        entity.types.map(async (typeInfo) => {
            const url = typeInfo.type.url;
            const typeData = await fetchData(url);
            const typeIconUrl = typeData.sprites["generation-viii"]["sword-shield"].name_icon;
            console.log(typeIconUrl)
            return `<img src="${typeIconUrl}" alt="${typeInfo.type.name} icon"/>`;
        })
    );

    // Join all the <img> elements into one string
    return typeImages.join('');
}

// Get clickable abilities for the details site
export function getAbilitiesAsButtons(entities) {
    return entities.abilities
        .map(item => 
            `<button class="ability-button">${item.ability.name.split("-").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</button>`)
        .join(', ');
}

// Return the total sum of each base stat value
export function getTotalBaseStats(entities) {
    return entities.stats.reduce((total, statObject) => total + statObject.base_stat, 0);
}

// Get parameters
export function getParams(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get(param);
    return id;
}