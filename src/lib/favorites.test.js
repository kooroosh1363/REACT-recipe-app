import { describe, expect, it } from "vitest";
import { readFavorites, toggleFavorite, writeFavorites } from "./favorites";

function memoryStorage(initial = {}) {
  const state = new Map(Object.entries(initial));
  return {
    getItem: (key) => state.get(key) ?? null,
    setItem: (key, value) => state.set(key, value),
  };
}

describe("favorites policy", () => {
  it("toggles ids deterministically", () => {
    expect(toggleFavorite([], 4)).toEqual([4]);
    expect(toggleFavorite([4], 4)).toEqual([]);
  });

  it("reads malformed storage safely", () => {
    const storage = memoryStorage({ "pantrypilot:favorites": "not-json" });
    expect(readFavorites(storage)).toEqual([]);
  });

  it("deduplicates before persistence", () => {
    const storage = memoryStorage();
    expect(writeFavorites([2, 2, 3], storage)).toEqual([2, 3]);
    expect(readFavorites(storage)).toEqual([2, 3]);
  });
});
