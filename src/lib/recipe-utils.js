export function normalizeQuery(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function filterRecipes(recipes, { query = "", category = "All", favoritesOnly = false, favorites = [] } = {}) {
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const normalizedQuery = normalizeQuery(query);
  const favoriteSet = new Set(Array.isArray(favorites) ? favorites.map(Number) : []);

  return safeRecipes.filter((recipe) => {
    if (!recipe || typeof recipe !== "object") return false;

    const matchesCategory = category === "All" || recipe.category === category;
    const matchesFavorite = !favoritesOnly || favoriteSet.has(Number(recipe.id));

    const haystack = [
      recipe.title,
      recipe.summary,
      recipe.category,
      ...(Array.isArray(recipe.tags) ? recipe.tags : []),
      ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesQuery = normalizedQuery === "" || haystack.includes(normalizedQuery);

    return matchesCategory && matchesFavorite && matchesQuery;
  });
}

export function sortRecipes(recipes, sort = "featured") {
  const list = Array.isArray(recipes) ? [...recipes] : [];

  if (sort === "time") {
    return list.sort((a, b) => Number(a.time || 0) - Number(b.time || 0));
  }

  if (sort === "title") {
    return list.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
  }

  return list;
}

export function formatRecipeCount(count) {
  const safeCount = Number.isFinite(Number(count)) ? Math.max(0, Math.trunc(Number(count))) : 0;
  return `${safeCount} recipe${safeCount === 1 ? "" : "s"}`;
}

export function mapSpoonacularRecipe(recipe) {
  return {
    id: Number(recipe.id),
    title: String(recipe.title || "Untitled recipe"),
    summary: "Live recipe result from Spoonacular.",
    category: recipe.vegetarian ? "Vegetarian" : "High Protein",
    time: Number(recipe.readyInMinutes || 30),
    difficulty: "Live result",
    image: String(recipe.image || ""),
    tags: [
      ...(recipe.vegetarian ? ["vegetarian"] : []),
      ...(recipe.vegan ? ["vegan"] : []),
      ...(recipe.glutenFree ? ["gluten-free"] : []),
    ],
    ingredients: [],
    instructions: [],
  };
}
