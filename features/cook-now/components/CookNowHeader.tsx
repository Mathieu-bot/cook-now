type Props = {
  selectedCount: number;
};

export function CookNowHeader({ selectedCount }: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
          Step 1
        </p>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          What do you have at home?
        </p>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
          Search and pick what you have on hand. We&apos;ll use this list to find matching recipes.
        </p>
      </div>
      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
        <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        <span>{selectedCount} selected</span>
      </div>
    </div>
  );
}
