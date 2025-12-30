type Props = {
  q?: string;
  action?: string;
  placeholder?: string;
};

export function RecipeSearchForm({ q, action = '/recipes', placeholder = 'Search recipes...' }: Props) {
  return (
    <form
      action={action}
      method="get"
      className="flex w-full max-w-md items-center gap-2"
    >
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        className="w-full rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
      >
        Search
      </button>
    </form>
  );
}
