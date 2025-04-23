/*╦╔╦╗╔═╗╔═╗╦═╗╔╦╗╔═╗
  ║║║║╠═╝║ ║╠╦╝ ║ ╚═╗
  ╩╩ ╩╩  ╚═╝╩╚═ ╩ ╚═╝*/
import "regenerator-runtime/runtime";
import { API_URL } from "./config.js";
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
    console.log(data);

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
