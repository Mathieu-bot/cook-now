import type { CookNowIngredientOption } from '../cookNow.types';

type Props = {
  visibleIngredients: CookNowIngredientOption[];
  selected: string[];
  hasSelection: boolean;
  toggleIngredient: (name: string) => void;
};

export function CookNowIngredientsList({
  visibleIngredients,
  selected,
  hasSelection,
  toggleIngredient,
}: Props) {
  return (
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
  );
}
