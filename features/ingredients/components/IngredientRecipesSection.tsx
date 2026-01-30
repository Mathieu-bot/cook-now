import { ChefHat, SearchX } from 'lucide-react';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import type { RecipeSummary } from '@/features/recipes/recipes.types';

type Props = {
  displayName: string;
  recipes: RecipeSummary[];
};

export function IngredientRecipesSection({ displayName, recipes }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        <ChefHat className="h-4 w-4 text-emerald-500" />
        <span>Recipes with {displayName}</span>
      </h2>
      {recipes.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <SearchX className="h-4 w-4" />
          <span>No recipes using this ingredient yet.</span>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
