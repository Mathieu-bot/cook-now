import Link from 'next/link';
import { RecipeFavoriteButton } from './RecipeFavoriteButton';
import type { RecipeSummary } from '../recipes.types';

type Props = {
  recipe: RecipeSummary;
};

export function RecipeCard({ recipe }: Props) {
  const prepTime = recipe.prepTimeMinutes ?? recipe.cookTimeMinutes;
  const metaParts: string[] = [];
  if (prepTime != null) metaParts.push(`${prepTime} min`);
  if (recipe.difficulty) metaParts.push(recipe.difficulty);
  if (recipe.hasVideo) metaParts.push('Video');

  const metaText = metaParts.join(' · ');
  const avatarLabel = (recipe.primaryCategory ?? 'CN').slice(0, 2).toUpperCase();

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative h-full">
        <Link href={`/recipes/${recipe.slug}`} className="flex h-full flex-col">
          <header className="flex items-center gap-3 px-4 pt-3 pb-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
              {avatarLabel}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300">
                {recipe.primaryCategory ?? 'CookNow recipe'}
              </p>
              {metaText && (
                <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                  {metaText}
                </p>
              )}
            </div>
          </header>

          {recipe.imageUrl && (
            <div className="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex flex-1 flex-col px-4 pb-3 pt-3">
            <h2 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
              {recipe.title}
            </h2>
            {recipe.summary && (
              <p className="mt-1 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                {recipe.summary}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Open recipe</span>
              </span>
              {recipe.hasVideo && (
                <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>Video inside</span>
                </span>
              )}
            </div>
          </div>
        </Link>
        <div className="pointer-events-auto absolute right-3 top-3 z-10">
          <RecipeFavoriteButton slug={recipe.slug} />
        </div>
      </div>
    </article>
  );
}
