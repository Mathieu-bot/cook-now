import { getRecipeBySlug } from '@/features/recipes/recipes.queries';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();

  if (!slug) {
    return new Response('Recipe slug is required', { status: 400 });
  }

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return new Response('Recipe not found', { status: 404 });
  }

  return Response.json(recipe);
}
