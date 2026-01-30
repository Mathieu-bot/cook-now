'use client';

import { useEffect, useState } from 'react';
import { useRecipeFilters } from '../hooks/useRecipeFilters';
import { Funnel } from 'lucide-react';

export function RecipeFiltersBar() {
  const {
    filters,
    setFilters,
    clearAllFilters,
    hasActiveFilters,
    activeFiltersCount,
  } = useRecipeFilters();

  const [categoryInput, setCategoryInput] = useState(filters.category ?? '');
  const [ingredientInput, setIngredientInput] = useState(filters.ingredient ?? '');

  useEffect(() => {
    setCategoryInput(filters.category ?? '');
  }, [filters.category]);

  useEffect(() => {
    setIngredientInput(filters.ingredient ?? '');
  }, [filters.ingredient]);

  return (
    <section className="mt-4 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            <Funnel className="h-3 w-3" />
            <span>Filters</span>
          </p>
          {hasActiveFilters && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-[11px] font-medium text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Category (e.g. Dessert, Pasta)"
          value={categoryInput}
          onChange={(event) => {
            const value = event.target.value;
            setCategoryInput(value);
            setFilters(
              { category: value || undefined },
              { resetPage: true },
            );
          }}
          className="h-9 min-w-[140px] rounded-full border border-zinc-300 bg-white px-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />

        <input
          type="text"
          placeholder="Ingredient (e.g. Chicken, Tomato)"
          value={ingredientInput}
          onChange={(event) => {
            const value = event.target.value;
            setIngredientInput(value);
            setFilters(
              { ingredient: value || undefined },
              { resetPage: true },
            );
          }}
          className="h-9 min-w-[160px] rounded-full border border-zinc-300 bg-white px-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={() =>
            setFilters(
              { favoritesOnly: !filters.favoritesOnly },
              { resetPage: true },
            )
          }
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition ${
            filters.favoritesOnly
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300'
              : 'border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Favorites only</span>
        </button>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-600 dark:text-zinc-300">
          {filters.category && (
            <button
              type="button"
              onClick={() =>
                setFilters({ category: '' }, { resetPage: true })
              }
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <span>Category: {filters.category}</span>
              <span className="text-xs">×</span>
            </button>
          )}
          {filters.ingredient && (
            <button
              type="button"
              onClick={() =>
                setFilters({ ingredient: '' }, { resetPage: true })
              }
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <span>Ingredient: {filters.ingredient}</span>
              <span className="text-xs">×</span>
            </button>
          )}
          {filters.favoritesOnly && (
            <button
              type="button"
              onClick={() =>
                setFilters(
                  { favoritesOnly: false },
                  { resetPage: true },
                )
              }
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <span>Favorites only</span>
              <span className="text-xs">×</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
