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

// Text Formatting Logic
function formatText(text) {
    return text
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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
    return formatText(name);
}

// General function to return a comma separated list
// from an array extracted from the API
export function getPropertyString(entities, property, key) {
    return entities[property].map(item => formatText(item[key].name)).join(', ');
}

// Return stats as <li> elements
// from an array extracted from the API
export function getStatsList(entity) {
    return entity["stats"].map(item => 
        `<li><b>${formatText(item["stat"].name)}:</b> ${item.base_stat}</li>`
    ).join(''); // Joining without separator so it returns a string of <li> elements
}

// Return types as images
export async function getTypesAsImages(entity) {
    const typeImages = await Promise.all(
        entity.types.map(async (typeInfo) => {
            const url = typeInfo.type.url;
            const typeData = await fetchData(url);
            const typeIconUrl = typeData.sprites["generation-viii"]["sword-shield"].name_icon;
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
            `<button class="ability-button" data-url="${item.ability.url}">${item.ability.name.split("-").map(word => 
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
    const parameter = urlParams.get(param);
    return parameter;
}

// Random Favorites Icon
// Array of Pokéball image URLs
const pokeballImages = [
    'images/balls/beastball.png',
    'images/balls/cherishball.png',
    'images/balls/diveball.png',
    'images/balls/dreamball.png',
    'images/balls/duskball.png',
    'images/balls/fastball.png',
    'images/balls/friendball.png',
    'images/balls/greatball.png',
    'images/balls/healball.png',
    'images/balls/heavyball.png',
    'images/balls/levelball.png',
    'images/balls/loveball.png',
    'images/balls/lureball.png',
    'images/balls/luxuryball.png',
    'images/balls/masterball.png',
    'images/balls/moonball.png',
    'images/balls/nestball.png',
    'images/balls/netball.png',
    'images/balls/parkball.png',
    'images/balls/pokeball.png',
    'images/balls/premierball.png',
    'images/balls/quickball.png',
    'images/balls/repeatball.png',
    'images/balls/safariball.png',
    'images/balls/sportball.png',
    'images/balls/strangeball.png',
    'images/balls/timerball.png',
    'images/balls/ultraball.png',
];


export function setFavoritesLogo(urlBase="") {
    // Select a random image URL
    const randomImage = pokeballImages[Math.floor(Math.random() * pokeballImages.length)];
    // Assign the random image to the src attribute of the img element
    document.querySelector(".fav-icon").src = urlBase + randomImage;
}

// Back to top button functionality
export function backToTopButton() {
    document.addEventListener("DOMContentLoaded", () => {
        const backToTopButton = document.querySelector(".back-to-top");
    
        // Show or hide the button based on scroll position
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) { // Show after scrolling down 300px
                backToTopButton.classList.remove("hidden");
            } else {
                backToTopButton.classList.add("hidden");
            }
        });
    
        // Scroll to top when the button is clicked
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
}