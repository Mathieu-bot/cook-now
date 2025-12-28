import Link from 'next/link';
import type { RecipeSummary } from '../recipes.types';

type Props = {
  recipe: RecipeSummary;
};

export function RecipeCard({ recipe }: Props) {
  const prepTime = recipe.prepTimeMinutes ?? recipe.cookTimeMinutes;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {recipe.imageUrl && (
        <Link
          href={`/recipes/${recipe.slug}`}
          className="block"
        >
          <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </div>


          <div className="flex flex-1 flex-col p-4">
            <div className="flex-1 space-y-2">
              {recipe.primaryCategory && (
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {recipe.primaryCategory}
                </span>
              )}
              <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {recipe.title}
              </h2>
              {recipe.summary && (
                <p className="mb-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {recipe.summary}
                </p>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex gap-3">
                {prepTime != null && <span>{prepTime} min</span>}
                {recipe.difficulty && (
                  <span className="capitalize">{recipe.difficulty}</span>
                )}
              </div>
              <div
                className="flex items-center gap-2 text-xs font-medium text-foreground hover:underline"
              >
                {recipe.hasVideo && (
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                    Video
                  </span>
                )}
                View recipe
              </div>
            </div>
          </div>
        </Link>
      )}
    </article>
  );
}
