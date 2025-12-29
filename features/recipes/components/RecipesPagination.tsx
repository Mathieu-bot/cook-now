import type { PaginationMeta } from '../recipes.types';

type Props = {
  pagination: PaginationMeta;
  pageSize: number;
  defaultPageSize?: number;
  q?: string;
  difficulty?: string;
  category?: string;
  ingredient?: string;
  maxCookTime?: number;
};

export function RecipesPagination({
  pagination,
  pageSize,
  defaultPageSize,
  q,
  difficulty,
  category,
  ingredient,
  maxCookTime,
}: Props) {
  if (pagination.totalPages <= 1) return null;

  const hasPrev = pagination.page > 1;
  const hasNext = pagination.page < pagination.totalPages;
  const basePageSize = defaultPageSize ?? pageSize;

  const buildPageLink = (targetPage: number) => {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set('page', String(targetPage));
    if (pageSize !== basePageSize) params.set('pageSize', String(pageSize));
    if (q) params.set('q', q);
     if (difficulty) params.set('difficulty', difficulty);
     if (category) params.set('category', category);
     if (ingredient) params.set('ingredient', ingredient);
     if (typeof maxCookTime === 'number' && !Number.isNaN(maxCookTime)) {
       params.set('maxCookTime', String(maxCookTime));
     }
    const qs = params.toString();
    return qs ? `/recipes?${qs}` : '/recipes';
  };

  return (
    <nav className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
      <div>
        Page {pagination.page} of {pagination.totalPages}
      </div>
      <div className="flex gap-2">
        <a
          href={hasPrev ? buildPageLink(pagination.page - 1) : '#'}
          aria-disabled={!hasPrev}
          className={`rounded-md px-3 py-1.5 ${
            hasPrev
              ? 'border border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed border border-transparent text-zinc-400 dark:text-zinc-600'
          }`}
        >
          Previous
        </a>
        <a
          href={hasNext ? buildPageLink(pagination.page + 1) : '#'}
          aria-disabled={!hasNext}
          className={`rounded-md px-3 py-1.5 ${
            hasNext
              ? 'border border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed border border-transparent text-zinc-400 dark:text-zinc-600'
          }`}
        >
          Next
        </a>
      </div>
    </nav>
  );
}
