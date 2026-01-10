'use client';

import { useRecipeFavorite } from '../hooks/useRecipeFavorite';

type Props = {
  slug: string;
};

export function RecipeFavoriteButton({ slug }: Props) {
  const {
    isFavorite,
    isLoading,
    isSaving,
    error,
    statusMessage,
    toggleFavorite,
  } = useRecipeFavorite(slug);

  const isBusy = isLoading || isSaving;

  const label = isFavorite ? 'Saved' : 'Save';

  return (
    <div className="flex flex-col items-end gap-1 text-xs">
      <button
        type="button"
        disabled={isBusy}
        onClick={() => {
          if (!isBusy) {
            void toggleFavorite();
          }
        }}
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition ${
          isFavorite
            ? 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 dark:border-emerald-400 dark:bg-emerald-500'
            : 'border-zinc-300 bg-white text-zinc-700 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
        } ${isBusy ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            isFavorite ? 'bg-emerald-400' : 'bg-zinc-400'
          }`}
        />
        <span>{label}</span>
      </button>
      {statusMessage && (
        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{statusMessage}</p>
      )}
      {error && !statusMessage && (
        <p className="max-w-xs text-[10px] text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
