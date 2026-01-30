import { ChefHat, Clock, Star, Users, Utensils, Video } from 'lucide-react';
import type { RecipeDetail } from '../recipes.types';

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
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            <ChefHat className="h-4 w-4 text-emerald-500" />
            <span>Recipe spotlight</span>
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Utensils className="h-3 w-3" />
              <span>{primaryCategory}</span>
            </span>
          )}
          {recipe.difficulty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 font-medium capitalize text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <ChefHat className="h-3 w-3" />
              <span>{recipe.difficulty}</span>
            </span>
          )}
          {prepTime != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <Clock className="h-3 w-3" />
              <span>Prep: {prepTime} min</span>
            </span>
          )}
          {cookTime != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <Clock className="h-3 w-3" />
              <span>Cook: {cookTime} min</span>
            </span>
          )}
          {recipe.servings != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <Users className="h-3 w-3" />
              <span>Servings: {recipe.servings}</span>
            </span>
          )}
          {recipe.rating.count > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 font-medium text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
              <span>
                Rating: {recipe.rating.average?.toFixed(1)} ({recipe.rating.count})
              </span>
            </span>
          )}
          {hasVideo && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
              <Video className="h-3 w-3" />
              <span>Video available</span>
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-end gap-3 md:mt-0 md:w-64">
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
