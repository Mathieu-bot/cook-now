import type { RecipeSummary } from '../recipes/recipes.types';

export type IngredientDetail = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  type: string | null;
  recipes: RecipeSummary[];
  recipesCount: number;
  categories: string[];
  videoRecipesCount: number;
};
