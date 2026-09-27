const STORAGE_KEY = "pantrypilot:favorites";

export function readFavorites(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

export function writeFavorites(favorites, storage = globalThis.localStorage) {
  const safe = Array.from(new Set((Array.isArray(favorites) ? favorites : []).map(Number).filter(Number.isFinite)));

  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }

  return safe;
}

export function toggleFavorite(favorites, recipeId) {
  const safe = Array.from(new Set((Array.isArray(favorites) ? favorites : []).map(Number).filter(Number.isFinite)));
  const id = Number(recipeId);

  if (!Number.isFinite(id)) return safe;
  return safe.includes(id) ? safe.filter((item) => item !== id) : [...safe, id];
}
