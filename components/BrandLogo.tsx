'use client';
import Image from 'next/image';
import Link from 'next/link';

export type BrandLogoProps = { size?: number; className?: string; title?: string };

export default function BrandLogo({ size = 28, className, title = 'Ìlọ̀ home' }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Go to home"
      className={`inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] ${className || ''}`.trim()}
    >
      <Image src="/brand/ilo-tortoise.svg" width={size} height={size} alt="Ìlọ̀ tortoise logo" priority />
      <span className="sr-only">{title}</span>
    </Link>
  );
}
