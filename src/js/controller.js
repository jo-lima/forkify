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
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";

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
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}

function controlPagination(page) {
  resultsView.render(model.getSearchResultPage(page)); // RENDER CURRENT PAGE
  paginationView.render(model.state.search); // RENDER PAGINATION
}

async function controlRecipes(recipe) {
  try {
    // |GET URL ID BY URL|
    const recipeID = window.location.hash.slice(1);
    if (!recipeID) return;

    recipeView.renderSpinner(recipeContainer); // RENDER SPINNER WHILE LOADING

    resultsView.update(model.getSearchResultPage()); // Update results to mark selected recipe
    bookmarksView.update(model.state.bookmarks); // Update bookmarks

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
    if (!query) return;

    await model.loadSearchResults(query); // LOADS THE RECIPES INTO THE STATE OBJECT
    resultsView.render(model.getSearchResultPage(1)); // RENDER CURRENT PAGE
    paginationView.render(model.state.search); // RENDER PAGINATION
  } catch (error) {
    console.log(error);
  }
}

function controlServings(newServings) {
  // Update recipe servings in state
  model.updateServings(newServings);

  // Update the view
  recipeView.update(model.state.recipe); // RENDER RECIPE
}

function controlAddBookmark() {
  // Remove/Add bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);

  // Update markup
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

init();
