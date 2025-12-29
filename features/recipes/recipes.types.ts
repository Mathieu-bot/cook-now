export type RecipeSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  difficulty: string | null;
  primaryCategory?: string | null;
  hasVideo?: boolean;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type RecipeListResult = {
  data: RecipeSummary[];
  pagination: PaginationMeta;
};

export type RecipeIngredientView = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  text: string | null;
};

export type RecipeDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  difficulty: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  instructions: string;
  createdAt: Date;
  updatedAt: Date;
  ingredients: RecipeIngredientView[];
  categories: string[];
  tags: string[];
  videos: unknown[];
  rating: {
    average: number | null;
    count: number;
  };
};
