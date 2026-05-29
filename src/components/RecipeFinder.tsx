"use client";

import type { RecipeRecommendation, RecommendRecipesResponse } from "@/lib/recipes/types";
import { FormEvent, KeyboardEvent, useState } from "react";

const MAX_INGREDIENTS = 10;

export default function RecipeFinder() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<RecipeRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function addIngredient(value: string) {
    const parts = value
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);

    if (parts.length === 0) {
      return;
    }

    setIngredients((current) => {
      const seen = new Set(current);
      const next = [...current];

      for (const part of parts) {
        if (seen.has(part) || next.length >= MAX_INGREDIENTS) {
          continue;
        }
        seen.add(part);
        next.push(part);
      }

      return next;
    });
    setInput("");
  }

  function handleAddClick() {
    addIngredient(input);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addIngredient(input);
    }
  }

  function removeIngredient(value: string) {
    setIngredients((current) => current.filter((item) => item !== value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pending = input.trim();
    const list =
      pending.length > 0
        ? [...ingredients, ...pending.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean)]
        : ingredients;

    const unique = Array.from(new Set(list)).slice(0, MAX_INGREDIENTS);

    if (unique.length === 0) {
      setError("Add at least one ingredient.");
      return;
    }

    if (pending) {
      setIngredients(unique);
      setInput("");
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch("/api/recipes/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: unique }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResults([]);
        setError(data.error ?? "Unable to find recipes right now.");
        return;
      }

      const payload = data as RecommendRecipesResponse;
      setResults(payload.recipes);
    } catch {
      setResults([]);
      setError("Unable to find recipes right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)] outline-none ring-0 placeholder:text-[color:var(--muted)] focus:border-[color:var(--border-strong)]"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="e.g. milk, eggs, sugar"
            type="text"
            value={input}
          />
          <button
            className="rounded-lg border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] px-5 py-3 text-sm font-bold text-[color:var(--foreground)] transition hover:bg-white"
            onClick={handleAddClick}
            type="button"
          >
            Add
          </button>
        </div>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <span
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-sm text-[color:var(--foreground)]"
                key={ingredient}
              >
                {ingredient}
                <button
                  aria-label={`Remove ${ingredient}`}
                  className="text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
                  onClick={() => removeIngredient(ingredient)}
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-[color:var(--muted)]">
          Add up to {MAX_INGREDIENTS} ingredients. Separate multiple items with commas.
        </p>

        <button
          className="rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading || (ingredients.length === 0 && input.trim().length === 0)}
          type="submit"
        >
          {loading ? "Finding recipes..." : "Find recipes"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--foreground)]">
          {error}
        </p>
      )}

      {searched && !loading && !error && results.length === 0 && (
        <p className="text-[color:var(--muted)]">
          No recipes matched those ingredients. Try fewer or more common pantry items.
        </p>
      )}

      {results.length > 0 && (
        <section className="space-y-4 border-t border-[color:var(--border)] pt-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Recommendations
            </p>
            <p className="text-sm text-[color:var(--muted)]">
              Ranked by how many of your ingredients each recipe uses.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
          {results.map((recipe) => (
            <article
              className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]"
              key={recipe.id}
            >
              <img
                alt={recipe.title}
                className="h-48 w-full object-cover"
                src={recipe.image}
              />
              <div className="space-y-3 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                  {recipe.matchPercent}% match · You have {recipe.usedIngredientCount}/
                  {recipe.usedIngredientCount + recipe.missedIngredientCount} ingredients
                </p>
                <h2 className="text-xl font-bold tracking-tight text-[color:var(--foreground)]">
                  {recipe.title}
                </h2>
                {recipe.missedIngredients.length > 0 && (
                  <p className="text-sm leading-relaxed text-[color:var(--muted)]">
                    Still need: {recipe.missedIngredients.slice(0, 5).join(", ")}
                    {recipe.missedIngredients.length > 5 ? "…" : ""}
                  </p>
                )}
                <a
                  className="inline-flex text-sm font-bold text-[color:var(--foreground)] underline"
                  href={recipe.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  View recipe
                </a>
              </div>
            </article>
          ))}
          </div>
        </section>
      )}
    </div>
  );
}
