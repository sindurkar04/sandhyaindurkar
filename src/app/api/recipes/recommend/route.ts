import { findRecipesByIngredients, normalizeIngredients } from "@/lib/recipes/spoonacular";
import type {
  RecommendRecipesError,
  RecommendRecipesRequest,
  RecommendRecipesResponse,
} from "@/lib/recipes/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: RecommendRecipesRequest;

  try {
    body = (await request.json()) as RecommendRecipesRequest;
  } catch {
    return NextResponse.json<RecommendRecipesError>(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const rawIngredients = Array.isArray(body.ingredients) ? body.ingredients : [];
  const ingredients = normalizeIngredients(
    rawIngredients.filter((item): item is string => typeof item === "string"),
  );

  if (ingredients.length === 0) {
    return NextResponse.json<RecommendRecipesError>(
      { error: "Add at least one ingredient." },
      { status: 400 },
    );
  }

  try {
    const recipes = await findRecipesByIngredients(ingredients);
    return NextResponse.json<RecommendRecipesResponse>({ recipes });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    if (message.includes("SPOONACULAR_API_KEY")) {
      return NextResponse.json<RecommendRecipesError>(
        { error: "Recipe search is not configured yet." },
        { status: 503 },
      );
    }

    if (message.includes("limit reached")) {
      return NextResponse.json<RecommendRecipesError>({ error: message }, { status: 429 });
    }

    return NextResponse.json<RecommendRecipesError>(
      { error: message },
      { status: 502 },
    );
  }
}
