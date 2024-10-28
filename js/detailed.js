// Imports
import { renderDetailsWithTemplate, loadDetailsEventListeners } from "./detailListing.mjs";
import { setFavoritesLogo, backToTopButton } from "./utils.mjs";

// Set Logo
setFavoritesLogo("../");

// Back to top button
backToTopButton();

// Render the site contents
renderDetailsWithTemplate();

// Load Event Listeners
loadDetailsEventListeners();