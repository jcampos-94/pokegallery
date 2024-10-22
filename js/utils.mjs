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
        return "Nidoran &#9792";
    }
    if (name === "nidoran-m") {
        return "Nidoran &#9794";
    }

    // Capitalize first letter of each word and replace hyphens with spaces
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}