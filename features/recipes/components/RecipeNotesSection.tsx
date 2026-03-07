'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  LogIn,
  NotebookPen,
  Save,
  User,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';
import type { AuthUser } from '@/features/auth/hooks/authApi';
import { useRecipeNote } from '../hooks/useRecipeNote';

export function RecipeNotesSection() {
  const router = useRouter();
  const pathname = usePathname();
  const match = pathname.match(/^\/recipes\/([^/]+)/);
  const slug = match?.[1] ?? null;

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const {
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
    handleSave,
  } = useRecipeNote(slug);

  if (!slug) {
    return null;
  }

  if (isLoggedOut) {
    return (
      <section className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
        <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          <Lock className="h-4 w-4 text-emerald-500" />
          <span>My notes</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Sign in to keep your own notes for this recipe. They are private and only visible to you.
        </p>
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setIsAuthModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
        >
          <LogIn className="h-3 w-3" />
          <span>Go to login</span>
        </button>

        <AuthModal
          open={isAuthModalOpen}
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(_: AuthUser) => {
            setIsAuthModalOpen(false);
            router.refresh();
          }}
        />
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
      <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        <NotebookPen className="h-4 w-4 text-emerald-500" />
        <span>My notes</span>
      </h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Jot down tweaks, reminders, or what you would change next time. Only you can see these notes.
      </p>

      <div className="mt-2 flex gap-3">
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
          <User className="h-4 w-4" />
        </div>

        <div className="flex-1 space-y-2">
          <textarea
            value={noteText}
            onChange={(event) => {
              setNoteText(event.target.value);
              setError(null);
            }}
            placeholder={isLoading ? 'Loading your note…' : 'Write your private notes for this recipe…'}
            className="min-h-[80px] w-full resize-y rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 outline-none ring-0 transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
            disabled={isLoading || isSaving}
          />

          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              {isSaving && (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving…</span>
                </span>
              )}
              {!isSaving && statusMessage && (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span>{statusMessage}</span>
                </span>
              )}
              {!isSaving && !statusMessage && lastUpdated && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    Last updated {new Date(lastUpdated).toLocaleString()}
                  </span>
                </span>
              )}
              {error && (
                <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>{error}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading || !hasChanges}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-emerald-800 dark:disabled:bg-emerald-900/40 dark:disabled:text-emerald-300"
            >
              <Save className="mr-1.5 h-3 w-3" />
              <span>{noteText.trim() ? 'Save note' : 'Save empty (clear)'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
