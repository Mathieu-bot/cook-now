import { Info } from 'lucide-react';

type Props = {
  displayName: string;
  description: string | null;
};

export function IngredientAboutSection({ displayName, description }: Props) {
  return (
    <section className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
      <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        <Info className="h-4 w-4 text-emerald-500" />
        <span>About {displayName}</span>
      </h2>
      {description ? (
        <p className="whitespace-pre-line">{description}</p>
      ) : (
        <p className="text-zinc-600 dark:text-zinc-400">
          No description is available for this ingredient yet.
        </p>
      )}
    </section>
  );
}
