import { getIngredientByName } from '@/features/ingredients/ingredients.queries';

type Params = {
  params: Promise<{
    name: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const resolvedParams = await params;
  const rawName = resolvedParams.name ?? '';
  const decodedName = decodeURIComponent(rawName);

  const ingredient = await getIngredientByName(decodedName);

  if (!ingredient) {
    return new Response('Ingredient not found', { status: 404 });
  }

  return Response.json(ingredient);
}
