'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type RecipeFilters = {
  q?: string;
  difficulty?: string;
  category?: string;
  ingredient?: string;
  maxCookTime?: number;
  page?: number;
  pageSize?: number;
};

export function useRecipeFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: RecipeFilters = useMemo(() => {
    const get = (key: string) => searchParams.get(key) || undefined;
    const getNumber = (key: string) => {
      const raw = searchParams.get(key);
      if (!raw) return undefined;
      const n = Number(raw);
      return Number.isNaN(n) ? undefined : n;
    };

    return {
      q: get('q'),
      difficulty: get('difficulty'),
      category: get('category'),
      ingredient: get('ingredient'),
      maxCookTime: getNumber('maxCookTime'),
      page: getNumber('page'),
      pageSize: getNumber('pageSize'),
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<RecipeFilters>, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());

      const setString = (key: string, value: string | undefined) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      };

      const setNumber = (key: string, value: number | undefined) => {
        if (value === undefined || value === null || Number.isNaN(value)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      };

      if (next.q !== undefined) setString('q', next.q || undefined);
      if (next.difficulty !== undefined) setString('difficulty', next.difficulty || undefined);
      if (next.category !== undefined) setString('category', next.category || undefined);
      if (next.ingredient !== undefined) setString('ingredient', next.ingredient || undefined);
      if (next.maxCookTime !== undefined) setNumber('maxCookTime', next.maxCookTime);
      if (next.page !== undefined) setNumber('page', next.page);
      if (next.pageSize !== undefined) setNumber('pageSize', next.pageSize);

      if (options?.resetPage) {
        params.delete('page');
      }

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  return { filters, setFilters };
}
