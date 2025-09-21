'use client';
import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-surface-1 c-on-surface-1 backdrop-blur supports-[backdrop-filter]:bg-surface-1/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <BrandLogo size={44} />
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/features" className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline">
            Features
          </Link>
          <Link href="/pricing" className={cn(buttonVariants({ size: 'md' }))}>
            Try Ìlọ̀
          </Link>
        </div>
        <button
          className="rounded-full bg-surface-2 c-on-surface-2 p-2 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/40 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="space-y-4 border-t border-[var(--border)] bg-surface-1 c-on-surface-1 p-4 md:hidden">
          <Link href="/features" onClick={() => setOpen(false)} className="block transition-colors hover:text-[var(--color-primary)]">
            Features
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block transition-colors hover:text-[var(--color-primary)]">
            Pricing
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block transition-colors hover:text-[var(--color-primary)]">
            About
          </Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="block transition-colors hover:text-[var(--color-primary)]">
            Blog
          </Link>
          <Link href="/pricing" className={cn(buttonVariants(), 'w-full text-center')} onClick={() => setOpen(false)}>
            Try Ìlọ̀
          </Link>
          <Link
            href="https://wa.me/2348104024943"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'ghost' }), 'w-full text-center')}
            onClick={() => setOpen(false)}
          >
            WhatsApp
          </Link>
        </div>
      )}
    </nav>
  );
}
