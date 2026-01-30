import { ExternalLink } from 'lucide-react';

type Props = {
  sourceUrl: string | null;
  sourceName: string | null;
};

export function RecipeSourceSection({ sourceUrl, sourceName }: Props) {
  if (!sourceUrl) return null;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      <p className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300">
          <ExternalLink className="h-3 w-3" />
        </span>
        <span>
          <span className="font-medium">Source: </span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 underline dark:text-emerald-300"
          >
            {sourceName || sourceUrl}
          </a>
        </span>
      </p>
    </section>
  );
}
