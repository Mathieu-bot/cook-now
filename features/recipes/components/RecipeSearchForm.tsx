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
      className="flex w-full max-w-xs gap-2"
    >
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-500 shadow-sm outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-700"
      />
      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}
