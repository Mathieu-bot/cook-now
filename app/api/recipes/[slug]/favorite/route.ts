import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

type FavoriteBody = {
  favorite?: unknown;
};

type FavoriteResponse = {
  isFavorite: boolean;
};

async function resolveRecipeFromParams(params: Params, userRequired: boolean = true) {
  const user = await getCurrentUser();

  if (userRequired && !user) {
    return {
      kind: 'unauthorized' as const,
      user: null,
      recipe: null,
    };
  }

  const resolved = await params.params;
  const slug = resolved.slug?.trim();

  if (!slug) {
    return {
      kind: 'bad-request' as const,
      user,
      recipe: null,
      error: 'Recipe slug is required.',
    };
  }

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!recipe) {
    return {
      kind: 'not-found' as const,
      user,
      recipe: null,
    };
  }

  return {
    kind: 'ok' as const,
    user,
    recipe,
  };
}

export async function GET(_request: Request, params: Params) {
  const resolved = await resolveRecipeFromParams(params, true);

  if (resolved.kind === 'unauthorized') {
    return Response.json(
      { error: 'You need to be logged in to view favorites.' },
      { status: 401 },
    );
  }

  if (resolved.kind === 'bad-request') {
    return Response.json(
      { error: resolved.error ?? 'Recipe slug is required.' },
      { status: 400 },
    );
  }

  if (resolved.kind === 'not-found') {
    return Response.json(
      { error: 'Recipe not found.' },
      { status: 404 },
    );
  }

  const { user, recipe } = resolved;

  if (!user || !recipe) {
    return Response.json(
      { error: 'Unexpected error while loading favorite state.' },
      { status: 500 },
    );
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId: recipe.id,
      },
    },
    select: { userId: true },
  });

  const body: FavoriteResponse = {
    isFavorite: Boolean(favorite),
  };

  return Response.json(body, { status: 200 });
}

export async function PUT(request: Request, params: Params) {
  const resolved = await resolveRecipeFromParams(params, true);

  if (resolved.kind === 'unauthorized') {
    return Response.json(
      { error: 'You need to be logged in to change favorites.' },
      { status: 401 },
    );
  }

  if (resolved.kind === 'bad-request') {
    return Response.json(
      { error: resolved.error ?? 'Recipe slug is required.' },
      { status: 400 },
    );
  }

  if (resolved.kind === 'not-found') {
    return Response.json(
      { error: 'Recipe not found.' },
      { status: 404 },
    );
  }

  const { user, recipe } = resolved;

  if (!user || !recipe) {
    return Response.json(
      { error: 'Unexpected error while updating favorite state.' },
      { status: 500 },
    );
  }

  let body: FavoriteBody;

  try {
    body = (await request.json()) as FavoriteBody;
  } catch {
    return Response.json(
      { error: 'We could not read your request. Please send JSON with a "favorite" field.' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return Response.json(
      { error: 'We could not read your request. Please send JSON with a "favorite" field.' },
      { status: 400 },
    );
  }

  const { favorite } = body;

  if (typeof favorite !== 'boolean') {
    return Response.json(
      { error: 'The "favorite" field must be a boolean.' },
      { status: 400 },
    );
  }

  if (favorite) {
    await prisma.favorite.upsert({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId: recipe.id,
        },
      },
      create: {
        userId: user.id,
        recipeId: recipe.id,
      },
      update: {},
    });
  } else {
    await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        recipeId: recipe.id,
      },
    });
  }

  const responseBody: FavoriteResponse = { isFavorite: favorite };

  return Response.json(responseBody, { status: 200 });
}
