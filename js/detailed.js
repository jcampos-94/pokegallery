// Imports
import { renderDetailsWithTemplate, loadDetailsEventListeners } from "./detailListing.mjs";
import { setFavoritesLogo } from "./utils.mjs";

// Set Logo
setFavoritesLogo("../");

// Render the site contents
renderDetailsWithTemplate();

// Load Event Listeners
loadDetailsEventListeners();