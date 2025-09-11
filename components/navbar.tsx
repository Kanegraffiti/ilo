'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/lib/analytics';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { track } = useAnalytics();
  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo/ilo-wordmark.svg" alt="Ìlọ̀" width={80} height={24} />
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" onClick={() => track('cta_whatsapp')}>
            <a href="https://wa.me/234000000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </Button>
          <Button onClick={() => track('cta_try')}>Try Ìlọ̀</Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-cream p-4 space-y-4">
          <Link href="/features" onClick={() => setOpen(false)} className="block">Features</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block">Pricing</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block">About</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="block">Blog</Link>
          <Button className="w-full" onClick={() => track('cta_try')}>Try Ìlọ̀</Button>
          <Button variant="outline" className="w-full" onClick={() => track('cta_whatsapp')}>
            <a href="https://wa.me/234000000000">WhatsApp</a>
          </Button>
        </div>
      )}
    </nav>
  );
}
