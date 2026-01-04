import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CookNowIngredientOption } from '../cookNow.types';
import { useCookNowSelection } from '../hooks/useCookNowSelection';
import { CookNowHeader } from './CookNowHeader';
import { CookNowSearchRow } from './CookNowSearchRow';
import { CookNowTypeChipsBar } from './CookNowTypeChipsBar';
import { CookNowIngredientsList } from './CookNowIngredientsList';

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

        <CookNowHeader selectedCount={selected.length} />
        <CookNowSearchRow
          search={search}
          onSearchChange={setSearch}
          showSelectedOnly={showSelectedOnly}
          onToggleShowSelectedOnly={() => setShowSelectedOnly((prev) => !prev)}
        />
        <CookNowTypeChipsBar
          activeType={activeType}
          typeChips={typeChips}
          setActiveType={setActiveType}
        />
        <CookNowIngredientsList
          visibleIngredients={visibleIngredients}
          selected={selected}
          hasSelection={hasSelection}
          toggleIngredient={toggleIngredient}
        />
      </form>
    </section>
  );
}
