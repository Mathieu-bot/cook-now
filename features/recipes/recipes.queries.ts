import type { Prisma } from '../../prisma/generated/prisma/client';
import { prisma } from '@/lib/db';
import type {
  RecipeDetail,
  RecipeListResult,
  RecipeSummary,
  CookNowSuggestion,
} from './recipes.types';

export type ListRecipesParams = {
  page: number;
  pageSize: number;
  q?: string | null;
  difficulty?: string | null;
  category?: string | null;
  ingredient?: string | null;
  maxCookTime?: number | null;
  favoritesOnly?: boolean;
  userId?: string | null;
};

export async function listRecipes({
  page,
  pageSize,
  q,
  difficulty,
  category,
  ingredient,
  maxCookTime,
  favoritesOnly,
  userId,
}: ListRecipesParams): Promise<RecipeListResult> {
  if (favoritesOnly && !userId) {
    return {
      data: [],
      pagination: {
        page,
        pageSize,
        total: 0,
        totalPages: 1,
      },
    };
  }

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
          name: { contains: value, mode: 'insensitive' },
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

  if (favoritesOnly && userId) {
    const [total, favorites] = await Promise.all([
      prisma.favorite.count({
        where: {
          userId,
          recipe: where,
        },
      }),
      prisma.favorite.findMany({
        where: {
          userId,
          recipe: where,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
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
      }),
    ]);

    const recipes = favorites
      .map((favorite) => favorite.recipe)
      .filter((recipe): recipe is NonNullable<(typeof favorites)[number]['recipe']> => Boolean(recipe));

    const totalPages = Math.max(Math.ceil(total / pageSize), 1);

    const data: RecipeSummary[] = recipes.map((recipe) => ({
      id: recipe.id,
      slug: recipe.slug,
      title: recipe.title,
      summary: recipe.summary,
      imageUrl: recipe.imageUrl,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      difficulty: recipe.difficulty,
      primaryCategory: recipe.categories[0]?.category.name ?? null,
      hasVideo: (recipe.videos?.length ?? 0) > 0,
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

export type SuggestRecipesFromIngredientsParams = {
	ingredients: string[];
	limit?: number;
};

export async function suggestRecipesFromIngredients({
	ingredients,
	limit = 24,
}: SuggestRecipesFromIngredientsParams): Promise<CookNowSuggestion[]> {
	const normalized = Array.from(
		new Set(
			(ingredients ?? [])
				.map((name) => name.trim())
				.filter((name) => name.length > 0),
		),
	);

	if (normalized.length === 0) {
		return [];
	}

	const recipes = await prisma.recipe.findMany({
		where: {
			ingredients: {
				some: {
					ingredient: {
						name: {
							in: normalized,
							mode: 'insensitive',
						},
					},
				},
			},
		},
		select: {
			id: true,
			slug: true,
			title: true,
			summary: true,
			imageUrl: true,
			prepTimeMinutes: true,
			cookTimeMinutes: true,
			difficulty: true,
			ingredients: {
				select: {
					ingredient: {
						select: {
							name: true,
						},
					},
				},
			},
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
	});

	const normalizedLower = normalized.map((name) => name.toLowerCase());

	const scored: CookNowSuggestion[] = recipes
		.map((recipe) => {
			const ingredientNames = recipe.ingredients.map((ri) =>
				ri.ingredient.name.toLowerCase(),
			);
			const uniqueIngredientNames = Array.from(new Set(ingredientNames));
			const matchCount = normalizedLower.filter((name) =>
				uniqueIngredientNames.includes(name),
			).length;
			const totalIngredients = uniqueIngredientNames.length;

			const suggestion: CookNowSuggestion = {
				id: recipe.id,
				slug: recipe.slug,
				title: recipe.title,
				summary: recipe.summary ?? null,
				imageUrl: recipe.imageUrl ?? null,
				prepTimeMinutes: recipe.prepTimeMinutes ?? null,
				cookTimeMinutes: recipe.cookTimeMinutes ?? null,
				difficulty: recipe.difficulty ?? null,
				primaryCategory:
					recipe.categories[0]?.category?.name ?? null,
				hasVideo: (recipe.videos?.length ?? 0) > 0,
				matchCount,
				totalIngredients,
			};

			return suggestion;
		})
		.filter((s) => s.matchCount > 0);

	scored.sort((a, b) => {
		if (b.matchCount !== a.matchCount) {
			return b.matchCount - a.matchCount;
		}
		return a.totalIngredients - b.totalIngredients;
	});

	return scored.slice(0, limit);
}

export async function listFavoriteRecipesForUser(userId: string): Promise<RecipeSummary[]> {
	if (!userId) {
		return [];
	}

	const favorites = await prisma.favorite.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		select: {
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
	});

	return favorites
		.map((favorite) => favorite.recipe)
		.filter((recipe): recipe is NonNullable<(typeof favorites)[number]['recipe']> => Boolean(recipe))
		.map((recipe) => ({
			id: recipe.id,
			slug: recipe.slug,
			title: recipe.title,
			summary: recipe.summary ?? null,
			imageUrl: recipe.imageUrl ?? null,
			prepTimeMinutes: recipe.prepTimeMinutes ?? null,
			cookTimeMinutes: recipe.cookTimeMinutes ?? null,
			difficulty: recipe.difficulty ?? null,
			primaryCategory: recipe.categories[0]?.category.name ?? null,
			hasVideo: (recipe.videos?.length ?? 0) > 0,
		}));
}
