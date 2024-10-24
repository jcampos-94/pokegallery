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

// Return the total sum of each base stat value
export function getTotalBaseStats(entities) {
    return entities.stats.reduce((total, statObject) => total + statObject.base_stat, 0);
}

// Load partials templates
async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
}

// Load Header and Footer
export async function loadHeaderFooter() {
    const header = await loadTemplate("/partials/header.html");
    const footer = await loadTemplate("/partials/footer.html");

    const headerElement = document.querySelector("header");
    const footerElement = document.querySelector("footer");
    
    headerElement.innerHTML = header;
    footerElement.innerHTML = footer;
}

// Get parameters
export function getParams(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get(param);
    return id;
}