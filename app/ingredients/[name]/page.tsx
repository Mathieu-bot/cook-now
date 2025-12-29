import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { getIngredientByName } from '@/features/ingredients/ingredients.queries';
import { IngredientHeader } from '@/features/ingredients/components/IngredientHeader';
import { IngredientAboutSection } from '@/features/ingredients/components/IngredientAboutSection';
import { IngredientRecipesSection } from '@/features/ingredients/components/IngredientRecipesSection';

type PageParams = {
  name: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

function formatIngredientName(name: string): string {
  if (!name) return name;
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function IngredientPage({ params }: PageProps) {
  const resolvedParams = await params;
  const ingredientNameParam = resolvedParams.name;

  const ingredient = await getIngredientByName(ingredientNameParam);

  if (!ingredient) notFound();

  const displayName = formatIngredientName(ingredient.name);

  return (
    <PageContainer className="gap-8">
      <IngredientHeader ingredient={ingredient} displayName={displayName} />
      <IngredientAboutSection
        displayName={displayName}
        description={ingredient.description}
      />
      <IngredientRecipesSection
        displayName={displayName}
        recipes={ingredient.recipes}
      />
    </PageContainer>
  );
}
