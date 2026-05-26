export type RecipeRecommendation = {
  id: number;
  title: string;
  image: string;
  matchPercent: number;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: string[];
  url: string;
};

export type RecommendRecipesRequest = {
  ingredients: string[];
};

export type RecommendRecipesResponse = {
  recipes: RecipeRecommendation[];
};

export type RecommendRecipesError = {
  error: string;
};
