import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { getIngredientByName } from '@/features/ingredients/ingredients.queries';

type PageParams = {
  name: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

function formatIngredientName(name: string): string {
  if (!name) return name;
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function IngredientPage({ params }: PageProps) {
  const resolvedParams = await params;
  const ingredientNameParam = resolvedParams.name;

  const ingredient = await getIngredientByName(ingredientNameParam);

  if (!ingredient) notFound();

  const displayName = formatIngredientName(ingredient.name);

  return (
    <PageContainer className="gap-8">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Ingredient
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
                  ? 'Used in 1 recipe'
                  : `Used in ${ingredient.recipesCount} recipes`}
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
            Browse recipes with {displayName}
          </Link>
        </div>
      </header>

      <section className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          About {displayName}
        </h2>
        {ingredient.description ? (
          <p className="whitespace-pre-line">{ingredient.description}</p>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">
            No description is available for this ingredient yet.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Recipes with {displayName}
        </h2>
        {ingredient.recipes.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No recipes using this ingredient yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ingredient.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
