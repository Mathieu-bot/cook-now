export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { listIngredients } from '@/features/ingredients/ingredients.queries';
import { RecipeSearchForm } from '@/features/recipes/components/RecipeSearchForm';
import { RecipesPagination } from '@/features/recipes/components/RecipesPagination';

const DEFAULT_PAGE_SIZE = 24;

type PageSearchParams = {
  page?: string;
  pageSize?: string;
  q?: string;
};

type PageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function IngredientsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const page = Math.max(Number(resolvedSearchParams.page) || 1, 1);
  const pageSize = Math.min(
    Math.max(Number(resolvedSearchParams.pageSize) || DEFAULT_PAGE_SIZE, 1),
    100,
  );
  const q = resolvedSearchParams.q?.trim() || undefined;

  const { data: ingredients, pagination } = await listIngredients({
    page,
    pageSize,
    q,
  });

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();

    if (q) params.set('q', q);
    if (targetPage > 1) params.set('page', String(targetPage));
    if (pageSize !== DEFAULT_PAGE_SIZE) params.set('pageSize', String(pageSize));

    const qs = params.toString();
    return qs ? `/ingredients?${qs}` : '/ingredients';
  };

  return (
    <PageContainer>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ingredients
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Explore all the little things that make our recipes tasty.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <RecipeSearchForm
            q={q}
            action="/ingredients"
            placeholder="Search ingredients..."
          />
        </div>
      </header>

      {ingredients.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          No ingredients match your search. Try another name.
        </p>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ingredients.map((ingredient) => (
            <Link
              key={ingredient.id}
              href={`/ingredients/${encodeURIComponent(ingredient.name)}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-3 h-28 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                {ingredient.imageUrl ? (
                  <img
                    src={ingredient.imageUrl}
                    alt={ingredient.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-500">
                    No photo yet
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-300">
                    {ingredient.name}
                  </h2>
                  {ingredient.type && (
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {ingredient.type}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                  {ingredient.recipesCount} recipes
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-xs text-zinc-600 dark:text-zinc-400">
                {ingredient.description
                  ? ingredient.description
                  : "We don't have a description for this ingredient yet."}
              </p>
            </Link>
          ))}
        </section>
      )}

      <RecipesPagination
        pagination={pagination}
        pageSize={pageSize}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        q={q}
        basePath="/ingredients"
      />
    </PageContainer>
  );
}
