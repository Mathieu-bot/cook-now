'use client';

import { useEffect, useState } from 'react';
import { LogIn, LogOut, UserPlus } from 'lucide-react';
import { AuthModal } from './AuthModal';
import type { AuthUser } from '@/features/auth/hooks/authApi';
import { getCurrentUser, logout } from '@/features/auth/hooks/authApi';

type AuthMode = 'login' | 'register';

export function HeaderAuthActions() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      setIsLoadingUser(true);
      const current = await getCurrentUser();
      if (!cancelled) {
        setUser(current);
        setIsLoadingUser(false);
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  function openModal(nextMode: AuthMode) {
    setMode(nextMode);
    setIsModalOpen(true);
  }

  function handleClose() {
    setIsModalOpen(false);
  }

  async function handleLogout() {
    const ok = await logout();
    if (ok) {
      setUser(null);
    }
  }

  function handleAuthSuccess(nextUser: AuthUser) {
    setUser(nextUser);
  }

  if (isLoadingUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {!user ? (
        <>
          <button
            type="button"
            onClick={() => openModal('login')}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Log in</span>
          </button>
          <button
            type="button"
            onClick={() => openModal('register')}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign up</span>
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline-block max-w-[140px] truncate">{user.email}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </>
      )}

      <AuthModal
        open={isModalOpen}
        mode={mode}
        onModeChange={setMode}
        onClose={handleClose}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
