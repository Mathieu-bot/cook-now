import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRecipeBySlug } from '@/features/recipes/recipes.queries';

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export default async function RecipeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const recipe = await getRecipeBySlug(resolvedParams.slug);

  if (!recipe) notFound();


  const prepTime = recipe.prepTimeMinutes ?? undefined;
  const cookTime = recipe.cookTimeMinutes ?? undefined;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Recipe
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {recipe.title}
        </h1>
        {recipe.summary && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {recipe.summary}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          {prepTime != null && <span>Prep: {prepTime} min</span>}
          {cookTime != null && <span>Cook: {cookTime} min</span>}
          {recipe.servings != null && <span>Servings: {recipe.servings}</span>}
          {recipe.difficulty && <span className="capitalize">Difficulty: {recipe.difficulty}</span>}
          {recipe.rating.count > 0 && (
            <span>
              Rating: {recipe.rating.average?.toFixed(1)} ({recipe.rating.count} ratings)
            </span>
          )}
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
        <aside className="space-y-4">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Ingredients
            </h2>
            {recipe.ingredients.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No ingredients listed.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-800 dark:text-zinc-200">
                {recipe.ingredients.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.quantity != null && <>{item.quantity} </>}
                      {item.unit && <>{item.unit} </>}
                      {item.text && <>{item.text} </>}
                    </span>
                    {" "}
                    <Link
                      href={`/ingredients/${encodeURIComponent(item.name)}`}
                      className="hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {(recipe.categories.length > 0 || recipe.tags.length > 0) && (
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              {recipe.categories.length > 0 && (
                <p>
                  <span className="font-medium">Categories:</span>{' '}
                  {recipe.categories.join(', ')}
                </p>
              )}
              {recipe.tags.length > 0 && (
                <p>
                  <span className="font-medium">Tags:</span>{' '}
                  {recipe.tags.join(', ')}
                </p>
              )}
            </div>
          )}
        </aside>

        <article className="space-y-4">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Instructions
            </h2>
            <div className="prose max-w-none whitespace-pre-line text-sm text-zinc-800 dark:prose-invert dark:text-zinc-200">
              {recipe.instructions}
            </div>
          </div>

          {recipe.sourceUrl && (
            <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
              Source:{' '}
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline"
              >
                {recipe.sourceName || recipe.sourceUrl}
              </a>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
