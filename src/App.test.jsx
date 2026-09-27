import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { demoRecipes } from "./data/recipes";

vi.mock("./services/recipe-service", () => ({
  loadFeaturedRecipes: vi.fn(async () => ({ source: "demo", recipes: demoRecipes })),
}));

describe("PantryPilot", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads the demo catalog and filters recipes", async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText("8 recipes")).toBeInTheDocument());

    const search = screen.getByRole("searchbox", { name: /search recipes or ingredients/i });
    await userEvent.type(search, "mushroom");

    expect(screen.getByText("1 recipe")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mushroom Miso Noodles" })).toBeInTheDocument();
  });

  it("persists favorites and supports saved-only filtering", async () => {
    render(<App />);
    await screen.findByText("8 recipes");

    const saveButton = screen.getByRole("button", { name: /add roasted tomato orzo to favorites/i });
    await userEvent.click(saveButton);
    await userEvent.click(screen.getByRole("checkbox", { name: /saved only/i }));

    expect(screen.getByText("1 recipe")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Roasted Tomato Orzo" })).toBeInTheDocument();
  });

  it("opens and closes recipe details", async () => {
    render(<App />);
    await screen.findByText("8 recipes");

    await userEvent.click(screen.getAllByRole("button", { name: /view recipe/i })[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
