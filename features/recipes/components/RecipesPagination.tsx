import type { PaginationMeta } from '../recipes.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  pagination: PaginationMeta;
  pageSize: number;
  defaultPageSize?: number;
  q?: string;
  difficulty?: string;
  category?: string;
  ingredient?: string;
  maxCookTime?: number;
  basePath?: string;
  favoritesOnly?: boolean;
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
  basePath,
  favoritesOnly,
}: Props) {
  if (pagination.totalPages <= 1) return null;

  const hasPrev = pagination.page > 1;
  const hasNext = pagination.page < pagination.totalPages;
  const basePageSize = defaultPageSize ?? pageSize;
  const base = basePath ?? '/recipes';

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
    if (favoritesOnly) {
      params.set('favoritesOnly', '1');
    }
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
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
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 ${
            hasPrev
              ? 'border border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed border border-transparent text-zinc-400 dark:text-zinc-600'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </a>
        <a
          href={hasNext ? buildPageLink(pagination.page + 1) : '#'}
          aria-disabled={!hasNext}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 ${
            hasNext
              ? 'border border-zinc-300 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              : 'cursor-not-allowed border border-transparent text-zinc-400 dark:text-zinc-600'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </nav>
  );
}
