import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: Props) {
  const base =
    'mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8';
  const merged = className ? `${base} ${className}` : base;

  return <main className={merged}>{children}</main>;
}
