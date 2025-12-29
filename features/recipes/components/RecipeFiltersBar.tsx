'use client';

import { useRecipeFilters } from '../hooks/useRecipeFilters';

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'All difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function RecipeFiltersBar() {
  const { filters, setFilters } = useRecipeFilters();

  return (
    <section className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-700 dark:text-zinc-200">
      <select
        value={filters.difficulty ?? ''}
        onChange={(event) =>
          setFilters(
            { difficulty: event.target.value || undefined },
            { resetPage: true },
          )
        }
        className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {DIFFICULTY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Category"
        value={filters.category ?? ''}
        onChange={(event) =>
          setFilters(
            { category: event.target.value || undefined },
            { resetPage: true },
          )
        }
        className="h-9 min-w-[140px] rounded-md border border-zinc-300 bg-white px-2 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      <input
        type="text"
        placeholder="Ingredient"
        value={filters.ingredient ?? ''}
        onChange={(event) =>
          setFilters(
            { ingredient: event.target.value || undefined },
            { resetPage: true },
          )
        }
        className="h-9 min-w-[160px] rounded-md border border-zinc-300 bg-white px-2 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      <input
        type="number"
        min={0}
        placeholder="Max cook time (min)"
        value={filters.maxCookTime ?? ''}
        onChange={(event) => {
          const raw = event.target.value;
          const n = raw ? Number(raw) : undefined;
          const value = n !== undefined && !Number.isNaN(n) ? n : undefined;
          setFilters({ maxCookTime: value }, { resetPage: true });
        }}
        className="h-9 w-40 rounded-md border border-zinc-300 bg-white px-2 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
    </section>
  );
}
