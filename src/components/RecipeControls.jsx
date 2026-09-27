export default function RecipeControls({
  query,
  category,
  sort,
  favoritesOnly,
  categories,
  onQueryChange,
  onCategoryChange,
  onSortChange,
  onFavoritesOnlyChange,
}) {
  return (
    <section className="controls" aria-label="Recipe filters">
      <label className="search-field">
        <span>Search recipes or ingredients</span>
        <input
          type="search"
          value={query}
          placeholder="Try mushroom, lemon, breakfast…"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <div className="controls__row">
        <div className="chip-group" role="group" aria-label="Recipe category">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "chip chip--active" : "chip"}
              aria-pressed={category === item}
              onClick={() => onCategoryChange(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="sort-control">
          <span>Sort</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="time">Fastest first</option>
            <option value="title">A–Z</option>
          </select>
        </label>

        <label className="toggle-control">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => onFavoritesOnlyChange(event.target.checked)}
          />
          <span>Saved only</span>
        </label>
      </div>
    </section>
  );
}
