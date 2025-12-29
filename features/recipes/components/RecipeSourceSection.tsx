type Props = {
  sourceUrl: string | null;
  sourceName: string | null;
};

export function RecipeSourceSection({ sourceUrl, sourceName }: Props) {
  if (!sourceUrl) return null;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      <p>
        <span className="font-medium">Source: </span>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-700 underline dark:text-emerald-300"
        >
          {sourceName || sourceUrl}
        </a>
      </p>
    </section>
  );
}
