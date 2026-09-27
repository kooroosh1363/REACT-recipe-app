export default function RecipeDetail({ recipe, favorite, onToggleFavorite, onClose }) {
  if (!recipe) return null;

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="recipe-detail" role="dialog" aria-modal="true" aria-labelledby="recipe-detail-title">
        <div className="recipe-detail__toolbar">
          <span>Recipe detail</span>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <img src={recipe.image} alt="" width="900" height="520" />

        <div className="recipe-detail__content">
          <div className="recipe-detail__heading">
            <div>
              <p className="eyebrow">{recipe.category} · {recipe.time} min · {recipe.difficulty}</p>
              <h2 id="recipe-detail-title">{recipe.title}</h2>
            </div>
            <button
              className="favorite-action"
              type="button"
              aria-pressed={favorite}
              onClick={() => onToggleFavorite(recipe.id)}
            >
              {favorite ? "Saved ♥" : "Save ♡"}
            </button>
          </div>

          <p className="recipe-detail__summary">{recipe.summary}</p>

          <div className="recipe-detail__columns">
            <section aria-labelledby="ingredients-title">
              <h3 id="ingredients-title">Ingredients</h3>
              {recipe.ingredients?.length ? (
                <ul>
                  {recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
                </ul>
              ) : (
                <p>Ingredient details are not included in this live preview.</p>
              )}
            </section>

            <section aria-labelledby="method-title">
              <h3 id="method-title">Method</h3>
              {recipe.instructions?.length ? (
                <ol>
                  {recipe.instructions.map((step) => <li key={step}>{step}</li>)}
                </ol>
              ) : (
                <p>Open the source recipe for full instructions when using live API data.</p>
              )}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
