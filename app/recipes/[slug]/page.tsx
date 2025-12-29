import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { getRecipeBySlug } from '@/features/recipes/recipes.queries';
import { RecipeDetailHeader } from '@/features/recipes/components/RecipeDetailHeader';
import { RecipeDetailSidebar } from '@/features/recipes/components/RecipeDetailSidebar';
import { RecipeDetailMainContent } from '@/features/recipes/components/RecipeDetailMainContent';

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export default async function RecipeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const recipe = await getRecipeBySlug(resolvedParams.slug);

  if (!recipe) notFound();


  return (
    <PageContainer className="gap-8">
      <RecipeDetailHeader recipe={recipe} />

      <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
        <RecipeDetailSidebar recipe={recipe} />
        <RecipeDetailMainContent recipe={recipe} />
      </section>
    </PageContainer>
  );
}
