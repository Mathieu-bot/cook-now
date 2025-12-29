import type { Prisma } from '../../prisma/generated/prisma/client';
import { prisma } from '@/lib/db';
import type {
  RecipeDetail,
  RecipeListResult,
  RecipeSummary,
} from './recipes.types';

export type ListRecipesParams = {
  page: number;
  pageSize: number;
  q?: string | null;
  difficulty?: string | null;
  category?: string | null;
  ingredient?: string | null;
  maxCookTime?: number | null;
};

export async function listRecipes({
  page,
  pageSize,
  q,
  difficulty,
  category,
  ingredient,
  maxCookTime,
}: ListRecipesParams): Promise<RecipeListResult> {
  const where: Prisma.RecipeWhereInput = {};

  if (q && q.trim().length > 0) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { summary: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (difficulty && difficulty.trim().length > 0) {
    where.difficulty = {
      equals: difficulty.trim(),
      mode: 'insensitive',
    };
  }

  if (category && category.trim().length > 0) {
    const value = category.trim();
    where.categories = {
      some: {
        category: {
          name: { equals: value, mode: 'insensitive' },
        },
      },
    };
  }

  if (ingredient && ingredient.trim().length > 0) {
    const value = ingredient.trim();
    where.ingredients = {
      some: {
        ingredient: {
          name: { contains: value, mode: 'insensitive' },
        },
      },
    };
  }

  if (typeof maxCookTime === 'number' && !Number.isNaN(maxCookTime)) {
    where.cookTimeMinutes = { lte: maxCookTime };
  }

  const [total, recipes] = await Promise.all([
    prisma.recipe.count({ where }),
    prisma.recipe.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        imageUrl: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        difficulty: true,
        categories: {
          take: 1,
          orderBy: {
            category: {
              name: 'asc',
            },
          },
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        videos: {
          select: { id: true },
          take: 1,
        },
      },
    }),
  ]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const data: RecipeSummary[] = recipes.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    imageUrl: r.imageUrl,
    prepTimeMinutes: r.prepTimeMinutes,
    cookTimeMinutes: r.cookTimeMinutes,
    difficulty: r.difficulty,
    primaryCategory: r.categories[0]?.category.name ?? null,
    hasVideo: (r.videos?.length ?? 0) > 0,
  }));

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

export async function getRecipeBySlug(slug: string): Promise<RecipeDetail | null> {
  // if (!slug) {
  //   return null;
  // }

  // const normalizedSlug = slug.trim().toLowerCase();
  // if (!normalizedSlug) {
  //   return null;
  // }

  const recipe = await prisma.recipe.findFirst({
    where: { slug },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      videos: true,
      ratings: true,
    },
  });

  if (!recipe) {
    return null;
  }

  const averageRating =
    recipe.ratings.length > 0
      ? recipe.ratings.reduce((sum, r) => sum + r.value, 0) / recipe.ratings.length
      : null;

  const ingredients = recipe.ingredients.map((ri) => ({
    id: ri.id,
    name: ri.ingredient.name,
    quantity: ri.quantity,
    unit: ri.unit,
    text: ri.text,
  }));

  const categories = recipe.categories.map((rc) => rc.category.name);
  const tags = recipe.tags.map((rt) => rt.tag.name);

  const detail: RecipeDetail = {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    summary: recipe.summary,
    imageUrl: recipe.imageUrl,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    sourceName: recipe.sourceName,
    sourceUrl: recipe.sourceUrl,
    instructions: recipe.instructions,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    ingredients,
    categories,
    tags,
    videos: recipe.videos,
    rating: {
      average: averageRating,
      count: recipe.ratings.length,
    },
  };

  return detail;
}
