import Link from 'next/link';
import type { RecipeDetail } from '../recipes.types';

type Props = {
  recipe: RecipeDetail;
};

export function RecipeDetailSidebar({ recipe }: Props) {
  return (
    <aside className="space-y-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Ingredients
        </h2>
        {recipe.ingredients.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No ingredients listed.</p>
        ) : (
          <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
            {recipe.ingredients.map((item) => (
              <li key={item.id} className="flex flex-wrap items-baseline gap-1">
                <span>
                  {item.quantity != null && <>{item.quantity} </>}
                  {item.unit && <>{item.unit} </>}
                  {item.text && <>{item.text} </>}
                </span>
                <Link
                  href={`/ingredients/${encodeURIComponent(item.name)}`}
                  className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(recipe.categories.length > 0 || recipe.tags.length > 0) && (
        <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
          {recipe.categories.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium">Categories</p>
              <div className="flex flex-wrap gap-2">
                {recipe.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
          {recipe.tags.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium">Tags</p>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
