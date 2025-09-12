'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-20 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2 font-bold">
          <Image
            src="/logo/ilo-wordmark.svg"
            alt="Ìlọ̀"
            width={80}
            height={24}
            className="pointer-events-none select-none"
          />
        </Link>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/features" className="underline">
            Features
          </Link>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            Try Ìlọ̀
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-cream p-4 space-y-4">
          <Link href="/features" onClick={() => setOpen(false)} className="block">
            Features
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block">
            Pricing
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block">
            About
          </Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="block">
            Blog
          </Link>
          <Link
            href="/pricing"
            className={cn(buttonVariants(), 'w-full text-center')}
            onClick={() => setOpen(false)}
          >
            Try Ìlọ̀
          </Link>
          <Link
            href="https://wa.me/234000000000"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full text-center')}
            onClick={() => setOpen(false)}
          >
            WhatsApp
          </Link>
        </div>
      )}
    </nav>
  );
}
