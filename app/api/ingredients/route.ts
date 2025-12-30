import { listIngredients } from '@/features/ingredients/ingredients.queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize')) || 24, 1), 100);
  const q = searchParams.get('q')?.trim() || undefined;

  const result = await listIngredients({ page, pageSize, q });

  return Response.json(result);
}
