export const dynamic = 'force-dynamic';

import { listRecipes } from '@/features/recipes/recipes.queries';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { RecipeSearchForm } from '@/features/recipes/components/RecipeSearchForm';
import { RecipesPagination } from '@/features/recipes/components/RecipesPagination';
import { RecipeFiltersBar } from '@/features/recipes/components/RecipeFiltersBar';

const DEFAULT_PAGE_SIZE = 12;

type PageSearchParams = {
  page?: string;
  pageSize?: string;
  q?: string;
  difficulty?: string;
  category?: string;
  ingredient?: string;
  maxCookTime?: string;
};

type PageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function RecipesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const page = Math.max(Number(resolvedSearchParams.page) || 1, 1);
  const pageSize = Math.min(
    Math.max(Number(resolvedSearchParams.pageSize) || DEFAULT_PAGE_SIZE, 1),
    50,
  );
  const q = resolvedSearchParams.q ?? undefined;
  const difficulty = resolvedSearchParams.difficulty ?? undefined;
  const category = resolvedSearchParams.category ?? undefined;
  const ingredient = resolvedSearchParams.ingredient ?? undefined;
  const maxCookTimeRaw = resolvedSearchParams.maxCookTime;
  const maxCookTime =
    maxCookTimeRaw && !Number.isNaN(Number(maxCookTimeRaw))
      ? Number(maxCookTimeRaw)
      : undefined;

  const { data: recipes, pagination } = await listRecipes({
    page,
    pageSize,
    q,
    difficulty,
    category,
    ingredient,
    maxCookTime,
  });

  return (
    <PageContainer>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Recipes
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            All our recipes in one place. Use the filters to find something that fits your mood.
          </p>
        </div>
        <RecipeSearchForm q={q} />
      </header>

      <RecipeFiltersBar />

      {recipes.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No recipes match your search. Try changing the filters or keywords.
        </p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}

      <RecipesPagination
        pagination={pagination}
        pageSize={pageSize}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        q={q}
        difficulty={difficulty}
        category={category}
        ingredient={ingredient}
        maxCookTime={maxCookTime}
      />
    </PageContainer>
  );
}
