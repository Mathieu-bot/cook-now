import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: 'You need to be logged in to view your notes for this recipe.' },
      { status: 401 },
    );
  }

  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) {
    return Response.json(
      { error: 'Recipe slug is required.' },
      { status: 400 },
    );
  }

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!recipe) {
    return Response.json({ error: 'Recipe not found.' }, { status: 404 });
  }

  const note = await prisma.recipeNote.findFirst({
    where: {
      userId: user.id,
      recipeId: recipe.id,
    },
    select: {
      id: true,
      text: true,
      updatedAt: true,
    },
  });

  return Response.json(
    note
      ? { note: { text: note.text, updatedAt: note.updatedAt } }
      : { note: null },
  );
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json(
      { error: 'You need to be logged in to save notes for this recipe.' },
      { status: 401 },
    );
  }

  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) {
    return Response.json(
      { error: 'Recipe slug is required.' },
      { status: 400 },
    );
  }

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!recipe) {
    return Response.json({ error: 'Recipe not found.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'We could not read your request. Please send JSON with a "text" field.' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return Response.json(
      { error: 'We could not read your request. Please send JSON with a "text" field.' },
      { status: 400 },
    );
  }

  const { text } = body as { text?: unknown };

  if (typeof text !== 'string') {
    return Response.json(
      { error: 'The "text" field must be a string.' },
      { status: 400 },
    );
  }

  const trimmed = text.trim();

  if (!trimmed) {
    await prisma.recipeNote.deleteMany({
      where: {
        userId: user.id,
        recipeId: recipe.id,
      },
    });

    return Response.json({ note: null }, { status: 200 });
  }

  const existing = await prisma.recipeNote.findFirst({
    where: {
      userId: user.id,
      recipeId: recipe.id,
    },
    select: { id: true },
  });

  let note;

  if (existing) {
    note = await prisma.recipeNote.update({
      where: { id: existing.id },
      data: { text: trimmed },
      select: { text: true, updatedAt: true },
    });
  } else {
    note = await prisma.recipeNote.create({
      data: {
        userId: user.id,
        recipeId: recipe.id,
        text: trimmed,
      },
      select: { text: true, updatedAt: true },
    });
  }

  return Response.json({ note }, { status: 200 });
}
