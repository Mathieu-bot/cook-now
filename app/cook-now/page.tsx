export const dynamic = 'force-dynamic';

import { listIngredients } from '@/features/ingredients/ingredients.queries';
import { suggestRecipesFromIngredients } from '@/features/recipes/recipes.queries';
import { CookNowView } from '@/features/cook-now/components/CookNowView';

const DEFAULT_LIMIT = 24;
const INGREDIENTS_PAGE_SIZE = 200;

type PageSearchParams = {
  have?: string;
};

type PageProps = {
  searchParams?: Promise<PageSearchParams>;
};

export default async function CookNowPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawHave = resolvedSearchParams.have?.trim() ?? '';

  const rawItems = rawHave
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const ingredients = Array.from(new Set(rawItems));
  const hasQuery = ingredients.length > 0;

  const suggestions = hasQuery
    ? await suggestRecipesFromIngredients({
        ingredients,
        limit: DEFAULT_LIMIT,
      })
    : [];

  const { data: allIngredients } = await listIngredients({
    page: 1,
    pageSize: INGREDIENTS_PAGE_SIZE,
    q: undefined,
  });

  const ingredientOptions = allIngredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    type: ingredient.type,
    imageUrl: ingredient.imageUrl,
  }));

  return (
    <CookNowView
      ingredients={ingredients}
      suggestions={suggestions}
      ingredientOptions={ingredientOptions}
    />
  );
}
