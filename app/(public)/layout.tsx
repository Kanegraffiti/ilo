import type { ReactNode } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { InstallPrompt } from '@/components/InstallPrompt';
import Footer from '@/components/footer/Footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-paper c-on-paper">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-surface-1 c-on-surface-1 backdrop-blur supports-[backdrop-filter]:bg-surface-1/90">
          <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between gap-6 px-4 py-4">
            <div className="flex items-center gap-3">
              <BrandLogo size={40} className="shrink-0" />
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="font-serif text-2xl">Ìlọ̀</span>
                <span className="text-sm opacity-70">Yorùbá fun for kids</span>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-lg md:flex" aria-label="Public">
              <Link href="/facts" className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline">
                Fun facts
              </Link>
              <Link href="/install" className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline">
                Install
              </Link>
              <Link href="/help" className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline">
                Help
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/auth/login"
                className="hidden text-lg font-semibold transition-colors hover:text-[var(--color-primary)] focus-visible:underline md:inline"
              >
                Log in
              </Link>
              <Button href="/auth/signup" size="md">
                Start learning
              </Button>
            </div>
          </div>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-screen-lg flex-1 px-4 pb-10 pt-28 md:pt-32" role="main">
          {children}
        </main>
        <aside className="border-t border-[var(--border)] bg-surface-1 c-on-surface-1 px-4 py-8">
          <div className="mx-auto max-w-screen-lg">
            <InstallPrompt />
          </div>
        </aside>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
