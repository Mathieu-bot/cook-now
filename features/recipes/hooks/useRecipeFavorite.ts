import { useEffect, useState } from 'react';
import { loadRecipeFavorite, saveRecipeFavorite } from './recipeFavoriteApi';

export function useRecipeFavorite(slug: string | null) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const currentSlug = slug;

    async function load() {
      setIsLoading(true);
      setError(null);
      setStatusMessage(null);

      const result = await loadRecipeFavorite(currentSlug);

      if (cancelled) return;

      if (result.kind === 'unauthorized') {
        setIsLoggedOut(true);
        setIsFavorite(false);
        setIsLoading(false);
        return;
      }

      if (result.kind === 'not-found') {
        setError('This recipe could not be found.');
        setIsLoading(false);
        return;
      }

      if (result.kind === 'error') {
        setError('Something went wrong while loading your favorite state.');
        setIsLoading(false);
        return;
      }

      if (result.kind === 'ok') {
        setIsFavorite(Boolean(result.isFavorite));
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function toggleFavorite() {
    if (!slug) return;
    const next = !isFavorite;

    setIsSaving(true);
    setError(null);
    setStatusMessage(null);

    const result = await saveRecipeFavorite(slug, next);

    if (result.kind === 'unauthorized') {
      setIsLoggedOut(true);
      setError('You need to be logged in to save favorites for this recipe.');
      setIsSaving(false);
      return;
    }

    if (result.kind === 'error') {
      setError('Something went wrong while saving your favorite.');
      setIsSaving(false);
      return;
    }

    if (result.kind === 'ok') {
      setIsFavorite(Boolean(result.isFavorite));
      setStatusMessage(Boolean(result.isFavorite) ? 'Added to favorites' : 'Removed from favorites');
      setIsSaving(false);
      setTimeout(() => {
        setStatusMessage(null);
      }, 2000);
    }
  }

  return {
    isFavorite,
    isLoading,
    isSaving,
    error,
    setError,
    statusMessage,
    isLoggedOut,
    toggleFavorite,
  };
}
