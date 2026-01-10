import type { RecipeDetail } from '../recipes.types';
import { RecipeFavoriteButton } from './RecipeFavoriteButton';

type Props = {
  recipe: RecipeDetail;
};

export function RecipeDetailHeader({ recipe }: Props) {
  const prepTime = recipe.prepTimeMinutes ?? undefined;
  const cookTime = recipe.cookTimeMinutes ?? undefined;
  const primaryCategory = recipe.categories[0] ?? null;
  const hasVideo = (recipe.videos?.length ?? 0) > 0;

  return (
    <header className="flex flex-col gap-6 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-start md:justify-between">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Recipe spotlight
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {recipe.title}
          </h1>
          {recipe.summary && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {recipe.summary}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          {primaryCategory && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {primaryCategory}
            </span>
          )}
          {recipe.difficulty && (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 font-medium capitalize text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              {recipe.difficulty}
            </span>
          )}
          {prepTime != null && (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              Prep: {prepTime} min
            </span>
          )}
          {cookTime != null && (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              Cook: {cookTime} min
            </span>
          )}
          {recipe.servings != null && (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              Servings: {recipe.servings}
            </span>
          )}
          {recipe.rating.count > 0 && (
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 font-medium text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              Rating: {recipe.rating.average?.toFixed(1)} ({recipe.rating.count})
            </span>
          )}
          {hasVideo && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
              <span>Video available</span>
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-end gap-3 md:mt-0 md:w-64">
        <RecipeFavoriteButton slug={recipe.slug} />
        {recipe.imageUrl && (
          <div className="w-full overflow-hidden rounded-xl bg-zinc-100 shadow-sm dark:bg-zinc-900">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
}
