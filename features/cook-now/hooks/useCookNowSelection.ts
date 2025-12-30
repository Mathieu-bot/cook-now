import { useMemo, useState } from 'react';
import type { CookNowIngredientOption } from '../cookNow.types';

type UseCookNowSelectionArgs = {
  initialSelected: string[];
  ingredientOptions: CookNowIngredientOption[];
};

export function useCookNowSelection({
  initialSelected,
  ingredientOptions,
}: UseCookNowSelectionArgs) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string>('all');
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const typeChips = useMemo(() => {
    const set = new Set<string>();
    for (const ingredient of ingredientOptions) {
      set.add(ingredient.type || 'Other');
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [ingredientOptions]);

  const filteredIngredients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ingredientOptions
      .filter((ingredient) => {
        const typeLabel = ingredient.type || 'Other';
        const matchesType = activeType === 'all' ? true : typeLabel === activeType;
        const matchesSearch =
          !term ||
          ingredient.name.toLowerCase().includes(term) ||
          typeLabel.toLowerCase().includes(term);
        return matchesType && matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [ingredientOptions, activeType, search]);

  const toggleIngredient = (name: string) => {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name],
    );
  };

  const hasSelection = selected.length > 0;
  const hiddenValue = useMemo(
    () => (hasSelection ? selected.join(', ') : ''),
    [hasSelection, selected],
  );

  return {
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
  };
}
