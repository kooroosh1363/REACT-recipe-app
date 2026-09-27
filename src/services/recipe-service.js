import { demoRecipes } from "../data/recipes";
import { mapSpoonacularRecipe } from "../lib/recipe-utils";

const API_BASE = "https://api.spoonacular.com";

export function hasLiveRecipeApi() {
  return Boolean(String(import.meta.env.VITE_SPOONACULAR_API_KEY || "").trim());
}

export async function loadFeaturedRecipes({ signal } = {}) {
  const apiKey = String(import.meta.env.VITE_SPOONACULAR_API_KEY || "").trim();

  if (!apiKey) {
    return {
      source: "demo",
      recipes: demoRecipes,
    };
  }

  const url = new URL("/recipes/random", API_BASE);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("number", "8");

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Recipe API request failed with status ${response.status}.`);
  }

  const payload = await response.json();
  const recipes = Array.isArray(payload.recipes) ? payload.recipes.map(mapSpoonacularRecipe) : [];

  return {
    source: "live",
    recipes: recipes.length > 0 ? recipes : demoRecipes,
  };
}
