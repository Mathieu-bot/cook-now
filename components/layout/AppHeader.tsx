import Link from 'next/link';
import { ChefHat, Utensils, Carrot } from 'lucide-react';
import { HeaderAuthActions } from '../auth/HeaderAuthActions';

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <ChefHat className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>Cook Now</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <nav className="flex items-center gap-4">
            <Link
              href="/cook-now"
              className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              <Utensils className="h-4 w-4" />
              <span>Cook now</span>
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              <ChefHat className="h-4 w-4" />
              <span>Recipes</span>
            </Link>
            <Link
              href="/ingredients"
              className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              <Carrot className="h-4 w-4" />
              <span>Ingredients</span>
            </Link>
          </nav>
        </div>
        <HeaderAuthActions />

      </div>
    </header>
  );
}
