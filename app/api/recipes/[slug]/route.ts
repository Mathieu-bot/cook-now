import { getRecipeBySlug } from '@/features/recipes/recipes.queries';

type Params = {
  params: {
    slug: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    return new Response('Recipe not found', { status: 404 });
  }

  return Response.json(recipe);
}
