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
      <section className="flex flex-col gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800 md:flex-row md:items-center md:justify-between text-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
            CookNow · Everyday cooking, less waste
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Cook something tasty with what you already have.
          </h1>
          <p className="max-w-xl ml-[50%] transform -translate-x-[50%] text-sm text-zinc-600 dark:text-zinc-400">
            Type the ingredients in your kitchen and we&apos;ll suggest simple, comforting
            recipes so you can stop scrolling and start cooking. No stress, no fancy
            gear, just real food.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 justify-center">
            <Link
              href="/cook-now"
              className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
            >
              Use my ingredients
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Browse all recipes
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs justify-center text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900">
              Decide what to cook in minutes
            </span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900">
              Start from what&apos;s already in your fridge
            </span>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900">
              Reduce food waste without overthinking it
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Fresh from the CookNow kitchen
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
            No recipes are available yet. Check back soon for something tasty!
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
