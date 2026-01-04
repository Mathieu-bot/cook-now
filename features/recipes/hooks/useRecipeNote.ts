import { useEffect, useState } from 'react';
import { loadRecipeNote, saveRecipeNote } from './recipeNoteApi';

export function useRecipeNote(slug: string | null) {
  const [noteText, setNoteText] = useState('');
  const [initialText, setInitialText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
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

      const result = await loadRecipeNote(currentSlug);

      if (cancelled) return;

      if (result.kind === 'unauthorized') {
        setIsLoggedOut(true);
        setNoteText('');
        setInitialText('');
        setLastUpdated(null);
        setIsLoading(false);
        return;
      }

      if (result.kind === 'not-found') {
        setError('This recipe could not be found.');
        setIsLoading(false);
        return;
      }

      if (result.kind === 'error') {
        setError('Something went wrong while loading your note.');
        setIsLoading(false);
        return;
      }

      if (result.kind === 'ok') {
        const note = result.note;
        if (note) {
          setNoteText(note.text ?? '');
          setInitialText(note.text ?? '');
          setLastUpdated(note.updatedAt ?? null);
        } else {
          setNoteText('');
          setInitialText('');
          setLastUpdated(null);
        }
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const hasChanges = noteText.trim() !== initialText.trim();

  async function handleSave() {
    if (!slug) return;
    const currentSlug = slug;

    setIsSaving(true);
    setError(null);
    setStatusMessage(null);

    const result = await saveRecipeNote(currentSlug, noteText);

    if (result.kind === 'unauthorized') {
      setIsLoggedOut(true);
      setStatusMessage(null);
      setError('You need to be logged in to save notes for this recipe.');
      setIsSaving(false);
      return;
    }

    if (result.kind === 'error') {
      setError('Something went wrong while saving your note.');
      setIsSaving(false);
      return;
    }

    if (result.kind === 'ok') {
      const note = result.note;
      if (note) {
        setInitialText(note.text ?? '');
        setNoteText(note.text ?? '');
        setLastUpdated(note.updatedAt ?? null);
        setStatusMessage('Note saved');
      } else {
        setInitialText('');
        setNoteText('');
        setLastUpdated(null);
        setStatusMessage('Note cleared');
      }
      setIsSaving(false);
      setTimeout(() => {
        setStatusMessage(null);
      }, 2500);
    }
  }

  return { 
    noteText, 
    setNoteText, 
    isLoading, 
    isSaving, 
    error, 
    setError, 
    statusMessage, 
    lastUpdated, 
    isLoggedOut, 
    hasChanges, 
    handleSave 
  };
}
