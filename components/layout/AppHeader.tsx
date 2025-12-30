import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Cook Now
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/cook-now" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Cook now
          </Link>
          <Link href="/recipes" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Recipes
          </Link>
          <Link href="/ingredients" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Ingredients
          </Link>
        </nav>
      </div>
    </header>
  );
}
