import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { InstallPrompt } from '@/components/InstallPrompt';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-ink/10 bg-paper/90" role="banner">
        <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between gap-6 px-4 py-4">
          <Link href="/" className="flex items-center gap-3 text-2xl font-serif">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-3xl" aria-hidden="true">
              🐢
            </span>
            <span>
              Ìlọ̀
              <span className="block text-sm font-sans text-ink/60">Yorùbá fun for kids</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-lg md:flex" aria-label="Public">
            <Link href="/facts" className="hover:text-primary focus-visible:underline">
              Fun facts
            </Link>
            <Link href="/install" className="hover:text-primary focus-visible:underline">
              Install
            </Link>
            <Link href="/help" className="hover:text-primary focus-visible:underline">
              Help
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden text-lg font-semibold text-primary underline-offset-4 hover:underline md:inline">
              Log in
            </Link>
            <Button href="/auth/signup" size="md">
              Get started
            </Button>
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-screen-lg flex-1 px-4 py-10" role="main">
        {children}
      </main>
      <aside className="border-t border-ink/10 bg-paper/95 px-4 py-8">
        <div className="mx-auto max-w-screen-lg">
          <InstallPrompt />
        </div>
      </aside>
      <footer className="border-t border-ink/10 bg-paper/90" role="contentinfo">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-4 px-4 py-6 text-lg text-ink/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Ìlọ̀ • Yorùbá learning made joyful.</p>
          <div className="flex gap-6">
            <Link href="/help" className="hover:text-primary focus-visible:underline">
              Contact
            </Link>
            <Link href="/legal/privacy" className="hover:text-primary focus-visible:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
