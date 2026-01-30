import { ListChecks } from 'lucide-react';

type Props = {
  instructions: string;
};

export function RecipeInstructionsSection({ instructions }: Props) {
  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        <ListChecks className="h-5 w-5 text-emerald-500" />
        <span>Instructions</span>
      </h2>
      <div className="prose max-w-none whitespace-pre-line rounded-xl bg-white p-4 text-sm text-zinc-800 shadow-sm dark:prose-invert dark:bg-zinc-950 dark:text-zinc-200">
        {instructions}
      </div>
    </section>
  );
}
