import type { ReactNode } from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="p-4 flex items-center justify-between shadow-sm" role="banner">
        <Link href="/" className="text-xl font-bold">Ìlọ̀</Link>
        <nav className="hidden md:flex gap-4" aria-label="Main">
          <Link href="/auth/login">Log in</Link>
        </nav>
      </header>
      <main className="flex-1" role="main">{children}</main>
      <footer className="p-4 text-center text-sm" role="contentinfo">
        © Ìlọ̀
      </footer>
    </div>
  );
}
