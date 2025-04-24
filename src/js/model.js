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
