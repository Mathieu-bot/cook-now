type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  showSelectedOnly: boolean;
  onToggleShowSelectedOnly: () => void;
};

export function CookNowSearchRow({
  search,
  onSearchChange,
  showSelectedOnly,
  onToggleShowSelectedOnly,
}: Props) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search an ingredient..."
          className="w-full rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 text-[11px] text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
          >
            Clear
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onToggleShowSelectedOnly}
        className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium transition ${
          showSelectedOnly
            ? 'border-emerald-500 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500'
            : 'border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
        }`}
      >
        {showSelectedOnly ? 'All ingredients' : 'Selected only'}
      </button>
    </div>
  );
}
