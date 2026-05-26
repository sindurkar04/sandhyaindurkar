import type { RecipeRecommendation } from "./types";

const SPOONACULAR_BASE = "https://api.spoonacular.com/recipes";
const MAX_INGREDIENTS = 10;
const DEFAULT_RESULT_COUNT = 12;

type SpoonacularIngredient = {
  name?: string;
};

type SpoonacularFindByIngredientsResult = {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients?: SpoonacularIngredient[];
};

export function normalizeIngredients(raw: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of raw) {
    const value = item.trim().toLowerCase();
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
    if (normalized.length >= MAX_INGREDIENTS) {
      break;
    }
  }

  return normalized;
}

function recipeUrl(id: number, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://spoonacular.com/recipes/${slug}-${id}`;
}

function toRecommendation(recipe: SpoonacularFindByIngredientsResult): RecipeRecommendation {
  const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
  const matchPercent =
    total > 0 ? Math.round((recipe.usedIngredientCount / total) * 100) : 0;

  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    matchPercent,
    usedIngredientCount: recipe.usedIngredientCount,
    missedIngredientCount: recipe.missedIngredientCount,
    missedIngredients: (recipe.missedIngredients ?? [])
      .map((item) => item.name?.trim())
      .filter((name): name is string => Boolean(name)),
    url: recipeUrl(recipe.id, recipe.title),
  };
}

export async function findRecipesByIngredients(
  ingredients: string[],
): Promise<RecipeRecommendation[]> {
  const apiKey = process.env.SPOONACULAR_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("SPOONACULAR_API_KEY is not configured.");
  }

  const normalized = normalizeIngredients(ingredients);

  if (normalized.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    apiKey,
    ingredients: normalized.join(","),
    number: String(DEFAULT_RESULT_COUNT),
    ranking: "2",
    ignorePantry: "true",
  });

  const response = await fetch(
    `${SPOONACULAR_BASE}/findByIngredients?${params.toString()}`,
    { next: { revalidate: 0 } },
  );

  if (response.status === 402 || response.status === 429) {
    throw new Error(
      "Recipe search limit reached. Please try again later.",
    );
  }

  if (!response.ok) {
    throw new Error("Unable to fetch recipe recommendations right now.");
  }

  const data = (await response.json()) as SpoonacularFindByIngredientsResult[];

  return data
    .map(toRecommendation)
    .sort((a, b) => b.matchPercent - a.matchPercent);
}
