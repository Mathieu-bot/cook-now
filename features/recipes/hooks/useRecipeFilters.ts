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
  favoritesOnly?: boolean;
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
    const getBooleanFlag = (key: string) => {
      const raw = searchParams.get(key);
      return raw === '1' ? true : undefined;
    };

    return {
      q: get('q'),
      difficulty: get('difficulty'),
      category: get('category'),
      ingredient: get('ingredient'),
      maxCookTime: getNumber('maxCookTime'),
      page: getNumber('page'),
      pageSize: getNumber('pageSize'),
      favoritesOnly: getBooleanFlag('favoritesOnly'),
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<RecipeFilters>, options?: { resetPage?: boolean }) => {
      const merged: RecipeFilters = {
        ...filters,
        ...next,
      };

      const params = new URLSearchParams();

      const setString = (key: string, value: string | undefined) => {
        if (!value) return;
        params.set(key, value);
      };

      const setNumber = (key: string, value: number | undefined) => {
        if (value === undefined || value === null || Number.isNaN(value)) return;
        params.set(key, String(value));
      };

      const setBooleanFlag = (key: string, value: boolean | undefined) => {
        if (!value) return;
        params.set(key, '1');
      };

      setString('q', merged.q);
      setString('difficulty', merged.difficulty);
      setString('category', merged.category);
      setString('ingredient', merged.ingredient);
      setNumber('maxCookTime', merged.maxCookTime);
      setBooleanFlag('favoritesOnly', merged.favoritesOnly);

      if (!options?.resetPage) {
        setNumber('page', merged.page);
      }
      setNumber('pageSize', merged.pageSize);

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, filters],
  );

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.category ||
          filters.ingredient ||
          filters.maxCookTime !== undefined ||
          filters.favoritesOnly,
      ),
    [filters],
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category) count += 1;
    if (filters.ingredient) count += 1;
    if (typeof filters.maxCookTime === 'number') count += 1;
    if (filters.favoritesOnly) count += 1;
    return count;
  }, [filters]);

  const clearAllFilters = useCallback(
    () =>
      setFilters(
        {
          category: '',
          ingredient: '',
          maxCookTime: undefined,
          favoritesOnly: false,
        },
        { resetPage: true },
      ),
    [setFilters],
  );

  return {
    filters,
    setFilters,
    clearAllFilters,
    hasActiveFilters,
    activeFiltersCount,
  };
}
