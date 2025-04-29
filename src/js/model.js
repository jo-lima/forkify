/*╦╔╦╗╔═╗╔═╗╦═╗╔╦╗╔═╗
  ║║║║╠═╝║ ║╠╦╝ ║ ╚═╗
  ╩╩ ╩╩  ╚═╝╩╚═ ╩ ╚═╝*/
import "regenerator-runtime/runtime";
import { API_URL } from "./config.js";
import { RESULTS_PER_PAGE } from "./config.js";
import { API_KEY } from "./config.js";
import { getJSON } from "./helpers.js";

/*███╗   ███╗ ██████╗ ██████╗ ███████╗██╗     
  ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║     
  ██╔████╔██║██║   ██║██║  ██║█████╗  ██║     
  ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║     
  ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗
  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝*/
// |STATE OBJECT|
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export async function loadRecipe(recipeID) {
  try {
    const data = await getJSON(`${API_URL}${recipeID}?key=${API_KEY}`); // LOAD RECIPE

    // |FORMATTING RECIPE OBJECT|
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some((bookmark) => bookmark.id === recipeID))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query; // SETTING SEARCH QUERY PROPERTY IN STATE OBJECT
    const { data } = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`); // LOAD RECIPES

    // |SETTING SEARCH REULSTS PROPERTY IN STATE OBJECT|
    state.search.results = data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });

    state.search.page = 1;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function getSearchResultPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe); // Add bookmark to state array
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export function deleteBookmark(recipeID) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(
    (bookmark) => bookmark.id === recipeID
  );
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked
  if (recipeID === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

function init() {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
}

init();

function clearBookmarks() {
  localStorage.clear("bookmarks");
}
