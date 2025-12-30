import Link from 'next/link';
import type { IngredientDetail } from '../ingredients.types';

type Props = {
  ingredient: IngredientDetail;
  displayName: string;
};

export function IngredientHeader({ ingredient, displayName }: Props) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Ingredient spotlight
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {displayName}
          </h1>
          {ingredient.type && (
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {ingredient.type}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ingredient.recipesCount > 0 && (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              {ingredient.recipesCount === 1
                ? 'Stars in 1 recipe'
                : `Stars in ${ingredient.recipesCount} recipes`}
            </span>
          )}
          {ingredient.videoRecipesCount > 0 && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
              {ingredient.videoRecipesCount === 1
                ? '1 recipe with video'
                : `${ingredient.videoRecipesCount} recipes with video`}
            </span>
          )}
        </div>
        {ingredient.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ingredient.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-3">
        {ingredient.imageUrl && (
          <div className="h-24 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
            <img
              src={ingredient.imageUrl}
              alt={displayName}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <Link
          href={`/recipes?ingredient=${encodeURIComponent(ingredient.name)}`}
          className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          Cook with {displayName}
        </Link>
      </div>
    </header>
  );
}
