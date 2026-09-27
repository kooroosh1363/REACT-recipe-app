export default function RecipeCard({ recipe, favorite, onToggleFavorite, onOpen }) {
  return (
    <article className="recipe-card">
      <div className="recipe-card__media">
        <img
          src={recipe.image}
          alt=""
          loading="lazy"
          width="640"
          height="420"
        />
        <button
          className="icon-button"
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
          onClick={() => onToggleFavorite(recipe.id)}
        >
          <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
        </button>
      </div>

      <div className="recipe-card__body">
        <div className="recipe-card__meta">
          <span>{recipe.category}</span>
          <span>{recipe.time} min</span>
        </div>
        <h2>{recipe.title}</h2>
        <p>{recipe.summary}</p>
        <button className="text-button" type="button" onClick={() => onOpen(recipe)}>
          View recipe
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}
