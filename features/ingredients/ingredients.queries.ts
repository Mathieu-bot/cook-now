import { prisma } from '@/lib/db';
import type { IngredientDetail } from './ingredients.types';
import type { RecipeSummary } from '../recipes/recipes.types';

export type IngredientSummary = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  type: string | null;
  recipesCount: number;
};

export type ListIngredientsResult = {
  data: IngredientSummary[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type ListIngredientsParams = {
  page: number;
  pageSize: number;
  q?: string | null;
};

export async function listIngredients({
  page,
  pageSize,
  q,
}: ListIngredientsParams): Promise<ListIngredientsResult> {
  const where: any = {};

  if (q && q.trim().length > 0) {
    const value = q.trim();
    where.OR = [
      { name: { contains: value, mode: 'insensitive' } },
      { description: { contains: value, mode: 'insensitive' } },
    ];
  }

  const [total, ingredients] = await Promise.all([
    prisma.ingredient.count({ where }),
    prisma.ingredient.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
      include: {
        recipes: true,
      },
    }),
  ]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const data: IngredientSummary[] = ingredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    description: ingredient.description ?? null,
    imageUrl: ingredient.imageUrl ?? null,
    type: ingredient.type ?? null,
    recipesCount: ingredient.recipes.length,
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

export async function getIngredientByName(name: string): Promise<IngredientDetail | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const ingredient = await prisma.ingredient.findFirst({
    where: {
      name: {
        equals: trimmed,
        mode: 'insensitive',
      },
    },
    include: {
      recipes: {
        include: {
          recipe: {
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
          },
        },
      },
    },
  });

  if (!ingredient) return null;

  const recipeMap = new Map<string, RecipeSummary>();

  for (const ri of ingredient.recipes) {
    const recipeId = ri.recipe.id;
    if (recipeMap.has(recipeId)) continue;

    recipeMap.set(recipeId, {
      id: ri.recipe.id,
      slug: ri.recipe.slug,
      title: ri.recipe.title,
      summary: ri.recipe.summary,
      imageUrl: ri.recipe.imageUrl,
      prepTimeMinutes: ri.recipe.prepTimeMinutes,
      cookTimeMinutes: ri.recipe.cookTimeMinutes,
      difficulty: ri.recipe.difficulty,
      primaryCategory: ri.recipe.categories[0]?.category.name ?? null,
      hasVideo: (ri.recipe.videos?.length ?? 0) > 0,
    });
  }

  const recipes: RecipeSummary[] = Array.from(recipeMap.values());

  const categorySet = new Set<string>();
  let videoRecipesCount = 0;

  for (const recipe of recipes) {
    if (recipe.primaryCategory) {
      categorySet.add(recipe.primaryCategory);
    }
    if (recipe.hasVideo) {
      videoRecipesCount += 1;
    }
  }

  const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b));

  const detail: IngredientDetail = {
    id: ingredient.id,
    name: ingredient.name,
    description: ingredient.description ?? null,
    imageUrl: ingredient.imageUrl ?? null,
    type: ingredient.type ?? null,
    recipes,
    recipesCount: recipes.length,
    categories,
    videoRecipesCount,
  };

  return detail;
}
