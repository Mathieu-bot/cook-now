import Link from 'next/link';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import type { CookNowSuggestion } from '@/features/recipes/recipes.types';

type Props = {
  ingredients: string[];
  suggestions: CookNowSuggestion[];
};

export function CookNowResultsPanel({ ingredients, suggestions }: Props) {
  const hasQuery = ingredients.length > 0;
  const hasSuggestions = suggestions.length > 0;

  const bestMatch = hasSuggestions
    ? suggestions.reduce((best, current) =>
        current.matchCount > best.matchCount ? current : best,
        suggestions[0],
      )
    : null;

  const usedCount = bestMatch ? bestMatch.matchCount : 0;
  const totalCount = bestMatch ? bestMatch.totalIngredients : 0;
  const missingCount = totalCount > usedCount ? totalCount - usedCount : 0;

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl bg-emerald-900 text-emerald-50 ring-1 ring-emerald-800 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-700/70 bg-emerald-950/40 px-4 py-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/80">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300 dark:text-emerald-300">
            Step 2
          </p>
          <h2 className="mt-1 text-sm font-semibold tracking-tight text-emerald-50 dark:text-zinc-50">
            Recipes you can cook now
          </h2>
        </div>
        {hasQuery && (
          <p className="max-w-[180px] text-right text-[11px] text-emerald-100/90 dark:text-zinc-400">
            {hasSuggestions
              ? `Showing ${suggestions.length} recipe${suggestions.length > 1 ? 's' : ''}.`
              : 'No matches yet for this selection.'}
          </p>
        )}
      </div>

      <div className="flex-1 px-4 pb-4 pt-3">
        {!hasQuery && (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-black/10 px-6 py-8 text-center text-sm text-emerald-50/90 dark:bg-zinc-900/80">
            <p>
              Start by selecting a few ingredients on the left to discover what you can cook.
            </p>
          </div>
        )}

        {hasQuery && !hasSuggestions && (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-amber-500/15 px-6 py-8 text-center text-sm text-amber-50 dark:bg-amber-500/20">
            <p>
              We couldn&apos;t find any recipes that use these ingredients. Try fewer items or more generic ingredients.
            </p>
          </div>
        )}

        {hasQuery && hasSuggestions && (
          <div className="mt-1 flex flex-col gap-3">
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestions.map((recipe) => (
                <div
                  key={recipe.id}
                  className="min-w-[220px] max-w-[260px] shrink-0"
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-emerald-100/80 dark:text-zinc-400">
              {bestMatch && (
                <p>
                  Top match uses{' '}
                  <span className="font-semibold text-emerald-200 dark:text-emerald-300">{usedCount}</span>{' '}
                  of your ingredients
                  {totalCount ? ` (${missingCount} missing on ${totalCount})` : ''}.
                </p>
              )}
              <Link
                href="/recipes"
                className="text-[11px] font-medium text-emerald-200 underline-offset-4 hover:text-emerald-100 hover:underline dark:text-emerald-300 dark:hover:text-emerald-200"
              >
                Voir toutes les recettes
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
