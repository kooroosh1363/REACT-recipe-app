import { useEffect, useMemo, useState } from "react";
import RecipeCard from "./components/RecipeCard";
import RecipeControls from "./components/RecipeControls";
import RecipeDetail from "./components/RecipeDetail";
import { recipeCategories } from "./data/recipes";
import { readFavorites, toggleFavorite, writeFavorites } from "./lib/favorites";
import { filterRecipes, formatRecipeCount, sortRecipes } from "./lib/recipe-utils";
import { loadFeaturedRecipes } from "./services/recipe-service";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [source, setSource] = useState("demo");
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => readFavorites());
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    loadFeaturedRecipes({ signal: controller.signal })
      .then((result) => {
        setRecipes(result.recipes);
        setSource(result.source);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setNotice("Live recipes could not be loaded. The demo catalog is still available after refresh without an API key.");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    writeFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    if (!selectedRecipe) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedRecipe(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedRecipe]);

  const visibleRecipes = useMemo(() => {
    const filtered = filterRecipes(recipes, {
      query,
      category,
      favoritesOnly,
      favorites,
    });
    return sortRecipes(filtered, sort);
  }, [recipes, query, category, favoritesOnly, favorites, sort]);

  const handleFavorite = (recipeId) => {
    setFavorites((current) => toggleFavorite(current, recipeId));
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <nav className="hero__nav" aria-label="Primary">
          <a className="brand" href="#discover">PantryPilot</a>
          <span className="mode-badge">{source === "live" ? "Live API" : "Demo catalog"}</span>
        </nav>

        <div className="hero__content">
          <p className="eyebrow">Recipe discovery workspace</p>
          <h1>Find dinner without the tab chaos.</h1>
          <p>
            Search a focused recipe catalog, filter by cooking style, save favorites locally,
            and inspect the details without leaving the workspace.
          </p>
        </div>
      </header>

      <section className="workspace" id="discover" aria-labelledby="discover-title">
        <div className="workspace__heading">
          <div>
            <p className="eyebrow">Discover</p>
            <h2 id="discover-title">Recipes that fit the moment</h2>
          </div>
          <p className="result-count" aria-live="polite">
            {status === "loading" ? "Loading recipes…" : formatRecipeCount(visibleRecipes.length)}
          </p>
        </div>

        <RecipeControls
          query={query}
          category={category}
          sort={sort}
          favoritesOnly={favoritesOnly}
          categories={recipeCategories}
          onQueryChange={setQuery}
          onCategoryChange={setCategory}
          onSortChange={setSort}
          onFavoritesOnlyChange={setFavoritesOnly}
        />

        {notice ? <div className="notice" role="status">{notice}</div> : null}

        {status === "loading" ? (
          <div className="skeleton-grid" aria-label="Loading recipes">
            {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index} />)}
          </div>
        ) : visibleRecipes.length > 0 ? (
          <div className="recipe-grid">
            {visibleRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                favorite={favorites.includes(Number(recipe.id))}
                onToggleFavorite={handleFavorite}
                onOpen={setSelectedRecipe}
              />
            ))}
          </div>
        ) : (
          <section className="empty-state" aria-live="polite">
            <span aria-hidden="true">⌕</span>
            <h2>No matching recipes</h2>
            <p>Try a broader search, another category, or turn off “Saved only”.</p>
            <button type="button" onClick={() => {
              setQuery("");
              setCategory("All");
              setFavoritesOnly(false);
            }}>
              Reset filters
            </button>
          </section>
        )}
      </section>

      <footer>
        <strong>PantryPilot</strong>
        <p>Local-first demo data. Optional Spoonacular adapter for development.</p>
      </footer>

      <RecipeDetail
        recipe={selectedRecipe}
        favorite={selectedRecipe ? favorites.includes(Number(selectedRecipe.id)) : false}
        onToggleFavorite={handleFavorite}
        onClose={() => setSelectedRecipe(null)}
      />
    </main>
  );
}
