export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { listFavoriteRecipesForUser } from '@/features/recipes/recipes.queries';

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <PageContainer>
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Your favorites
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to start saving recipes you love and come back to them later.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Use the login button in the header to access your account.
          </p>
          <Link
            href="/recipes"
            className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
          >
            Browse recipes
          </Link>
        </section>
      </PageContainer>
    );
  }

  const recipes = await listFavoriteRecipesForUser(user.id);

  return (
    <PageContainer>
      <header className="mb-4 flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Your favorites
            </p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {user.email}
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          All the recipes you&apos;ve saved in one place, in a simple feed.
        </p>
      </header>

      {recipes.length === 0 ? (
        <section className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <p>You haven&apos;t saved any recipes yet.</p>
          <p>
            Browse the recipes list and look for the favorite action to start building your personal cookbook.
          </p>
          <Link
            href="/recipes"
            className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Go to recipes
          </Link>
        </section>
      ) : (
        <section className="mt-4 space-y-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
    </PageContainer>
  );
}
