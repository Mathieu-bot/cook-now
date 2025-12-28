import Link from 'next/link';
import { listRecipes } from '@/features/recipes/recipes.queries';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { PageContainer } from '@/components/layout/PageContainer';

export default async function Home() {
  const { data: recentRecipes } = await listRecipes({
    page: 1,
    pageSize: 3,
    q: undefined,
  });

  return (
    <PageContainer className="gap-10">
      <section className="flex flex-col gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Cook Now
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Discover recipes, cook faster.
          </h1>
          <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            A focused recipe app powered by your own database. Browse dishes, inspect
            ingredients, and get to the cooking part quickly.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/recipes"
              className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
            >
              Browse recipes
            </Link>
            <Link
              href="/recipes?q=quick"
              className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Quick meals
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Latest recipes
          </h2>
          <Link
            href="/recipes"
            className="text-sm font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
          >
            View all
          </Link>
        </div>

        {recentRecipes.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No recipes imported yet. Add some entries to your dataset and run the
            import script.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
