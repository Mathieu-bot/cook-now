import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import type { RecipeSummary } from '@/features/recipes/recipes.types';

type Props = {
  displayName: string;
  recipes: RecipeSummary[];
};

export function IngredientRecipesSection({ displayName, recipes }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Recipes with {displayName}
      </h2>
      {recipes.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No recipes using this ingredient yet.
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
