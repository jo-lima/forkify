if (module.hot) {
  module.hot.accept();
}

/*
╦╔╦╗╔═╗╔═╗╦═╗╔╦╗╔═╗
║║║║╠═╝║ ║╠╦╝ ║ ╚═╗
╩╩ ╩╩  ╚═╝╩╚═ ╩ ╚═╝ */
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

/*
 ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗ 
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝*/

const recipeContainer = document.querySelector(".recipe");

// |ADDING THE controlRecipes() FUNCTION AS A HANDLER
function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}

async function controlRecipes(recipe) {
  try {
    // |GET URL ID BY URL|
    const recipeID = window.location.hash.slice(1);
    if (!recipeID) return;

    recipeView.renderSpinner(recipeContainer); // RENDER SPINNER WHILE LOADING

    await model.loadRecipe(recipeID); // GET RECIPE
    recipeView.render(model.state.recipe); // RENDER RECIPE
  } catch (error) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery(); // RETURNS INPUT QUERY
    console.log(query);
    if (!query) return;

    await model.loadSearchResults(query); // LOADS THE RECIPES INTO THE STATE OBJECT
    resultsView.render(model.state.search.results);
  } catch (error) {
    console.log(error);
  }
}

init();
