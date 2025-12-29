import { listRecipes } from '@/features/recipes/recipes.queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize')) || 12, 1), 50);
  const q = searchParams.get('q')?.trim() || undefined;
  const difficulty = searchParams.get('difficulty')?.trim() || undefined;
  const category = searchParams.get('category')?.trim() || undefined;
  const ingredient = searchParams.get('ingredient')?.trim() || undefined;

  const maxCookTimeRaw = searchParams.get('maxCookTime');
  const maxCookTime =
    maxCookTimeRaw && !Number.isNaN(Number(maxCookTimeRaw))
      ? Number(maxCookTimeRaw)
      : undefined;

  const result = await listRecipes({
    page,
    pageSize,
    q,
    difficulty,
    category,
    ingredient,
    maxCookTime,
  });

  return Response.json(result);
}
