'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { AuthUser } from '@/features/auth/hooks/authApi';
import { login, register } from '@/features/auth/hooks/authApi';

type AuthMode = 'login' | 'register';

type Props = {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
};

export function AuthModal({ open, mode, onModeChange, onClose, onAuthSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const isLogin = mode === 'login';
  const title = isLogin ? 'Log in to Cook Now' : 'Create your Cook Now account';
  const primaryLabel = isLogin ? 'Log in' : 'Create account';

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in both email and password.');
      setIsSubmitting(false);
      return;
    }

    const action = isLogin ? login : register;
    const result = await action(trimmedEmail, trimmedPassword);

    if (!result.ok) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    onAuthSuccess(result.user);
    setIsSubmitting(false);
    setEmail('');
    setPassword('');
    onClose();
  }

  function switchMode(next: AuthMode) {
    if (next === mode) return;
    onModeChange(next);
    setError(null);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900"
          >
            Close
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
              placeholder="you@example.com"
              autoComplete={isLogin ? 'email' : 'new-email'}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
              placeholder={isLogin ? 'Your password' : 'At least 8 characters'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isSubmitting ? (isLogin ? 'Logging in…' : 'Creating account…') : primaryLabel}
          </button>

          <p className="pt-1 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
            {isLogin ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>,
    document.body
  );
}
