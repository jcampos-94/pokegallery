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