import { describe, expect, it } from "vitest";
import { filterRecipes, formatRecipeCount, mapSpoonacularRecipe, normalizeQuery, sortRecipes } from "./recipe-utils";

const recipes = [
  { id: 1, title: "Lemon Pasta", summary: "Bright dinner", category: "Vegetarian", time: 20, tags: ["quick"], ingredients: ["lemon"] },
  { id: 2, title: "Bean Bowl", summary: "Hearty lunch", category: "Vegan", time: 15, tags: ["fiber"], ingredients: ["beans"] },
];

describe("recipe utilities", () => {
  it("normalizes user search text", () => {
    expect(normalizeQuery("  LeMon ")).toBe("lemon");
  });

  it("filters across title, tags, and ingredients", () => {
    expect(filterRecipes(recipes, { query: "lemon" })).toHaveLength(1);
    expect(filterRecipes(recipes, { category: "Vegan" })[0].id).toBe(2);
    expect(filterRecipes(recipes, { favoritesOnly: true, favorites: [2] })[0].id).toBe(2);
  });

  it("sorts without mutating the input", () => {
    const sorted = sortRecipes(recipes, "time");
    expect(sorted.map((recipe) => recipe.id)).toEqual([2, 1]);
    expect(recipes.map((recipe) => recipe.id)).toEqual([1, 2]);
  });

  it("formats accessible result counts", () => {
    expect(formatRecipeCount(1)).toBe("1 recipe");
    expect(formatRecipeCount(4)).toBe("4 recipes");
  });

  it("maps live API recipes into the app model", () => {
    expect(mapSpoonacularRecipe({ id: 9, title: "Soup", readyInMinutes: 22, vegetarian: true }).category).toBe("Vegetarian");
  });
});
