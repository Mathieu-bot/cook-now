import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CookNowIngredientOption } from '../cookNow.types';
import { useCookNowSelection } from '../hooks/useCookNowSelection';

type Props = {
  initialSelected: string[];
  ingredientOptions: CookNowIngredientOption[];
};

export function CookNowSelectionPanel({ initialSelected, ingredientOptions }: Props) {
  const {
    search,
    setSearch,
    activeType,
    setActiveType,
    selected,
    toggleIngredient,
    typeChips,
    filteredIngredients,
    hasSelection,
    hiddenValue,
  } = useCookNowSelection({ initialSelected, ingredientOptions });

  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keep URL `have` query param in sync so results refresh automatically
  useEffect(() => {
    if (!searchParams) return;

    const currentHave = searchParams.get('have') ?? '';
    const targetHave = hasSelection ? hiddenValue : '';

    if (currentHave === targetHave) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (!targetHave) {
      params.delete('have');
    } else {
      params.set('have', targetHave);
    }

    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { scroll: false });
  }, [hasSelection, hiddenValue, pathname, router, searchParams]);

  const visibleIngredients = showSelectedOnly
    ? filteredIngredients.filter((ingredient) => selected.includes(ingredient.name))
    : filteredIngredients;

  return (
    <section className="h-full rounded-2xl bg-white/95 p-4 text-sm ring-1 ring-zinc-100 dark:bg-zinc-900/90 dark:ring-zinc-800 sm:p-5">
      <form
        className="flex h-full flex-col gap-4"
        onSubmit={(event) => event.preventDefault()}
        action="/cook-now"
      >
        <input
          type="hidden"
          name="have"
          value={hiddenValue}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
              Step 1
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              What do you have at home?
            </p>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              Search and pick what you have on hand. We&apos;ll use this list to find matching recipes.
            </p>
          </div>
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span>{selected.length} selected</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search an ingredient..."
              className="w-full rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 text-[11px] text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowSelectedOnly((prev) => !prev)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium transition ${
              showSelectedOnly
                ? 'border-emerald-500 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500'
                : 'border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
            }`}
          >
            {showSelectedOnly ? 'All ingredients' : 'Selected only'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveType('all')}
            className={`rounded-full border px-3 py-1 ${
              activeType === 'all'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
            }`}
          >
            All
          </button>
          {typeChips.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`rounded-full border px-3 py-1 text-xs ${
                activeType === type
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-2 flex-1 space-y-2">
          <div className="relative">
            <div className="max-h-80 overflow-y-auto pr-1 text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {visibleIngredients.map((ingredient) => {
                  const isSelected = selected.includes(ingredient.name);
                  const typeLabel = ingredient.type || 'Other';

                  return (
                    <button
                      key={ingredient.id}
                      type="button"
                      onClick={() => toggleIngredient(ingredient.name)}
                      className={`group flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-100/80 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-200'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-emerald-400 hover:bg-emerald-50/60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-100">
                        {ingredient.imageUrl ? (
                          <img
                            src={ingredient.imageUrl}
                            alt={ingredient.name}
                            className="h-full w-full rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span>{ingredient.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="line-clamp-1 font-medium">{ingredient.name}</p>
                        {ingredient.type && (
                          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            {typeLabel}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}

                {visibleIngredients.length === 0 && (
                  <p className="col-span-full py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    No ingredients match your search.
                  </p>
                )}
              </div>
            </div>
            {visibleIngredients.length > 0 && (
              <>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-linear-to-b from-white to-transparent dark:from-zinc-900" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-linear-to-t from-white to-transparent dark:from-zinc-900" />
              </>
            )}
          </div>

          <p className="text-right text-[10px] text-zinc-400 dark:text-zinc-500">
            Scroll to see more ingredients
          </p>

          {hasSelection && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-600 dark:text-zinc-300">
              <span className="font-medium text-zinc-700 dark:text-zinc-200">Selected:</span>
              {selected.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleIngredient(name)}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-800 transition hover:bg-emerald-50 hover:text-emerald-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-200"
                >
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">×</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
