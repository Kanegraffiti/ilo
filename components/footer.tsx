import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';
import { withContrast } from '@/components/withContrast';
import type { HTMLAttributes } from 'react';

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterSection = {
  heading: string;
  links: FooterLink[];
};

const SECTIONS: FooterSection[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'WhatsApp', href: 'https://wa.me/2348104024943', external: true },
      { label: 'Instagram', href: 'https://instagram.com', external: true },
      { label: 'Twitter', href: 'https://twitter.com', external: true },
    ],
  },
];

function MeadowScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 220"
      className={className ? `w-full ${className}` : 'w-full'}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="1200" height="220" fill="#FFF8F1" />
      <path
        d="M0 150 C120 120 240 180 360 150 C520 120 680 190 840 150 C960 130 1080 170 1200 150 L1200 220 L0 220 Z"
        fill="#FBE4CC"
      />
      <path
        d="M0 182 C140 158 280 210 420 182 C600 150 780 215 960 195 C1080 185 1140 204 1200 198 L1200 220 L0 220 Z"
        fill="#F6D5B3"
      />
      <circle cx="1050" cy="70" r="34" fill="#FFD77E" opacity="0.6" />
      <g transform="translate(130 118)">
        <rect x="-7" y="40" width="14" height="62" rx="5" fill="#AA7658" />
        <circle cx="0" cy="26" r="26" fill="#4CA676" />
        <circle cx="-18" cy="44" r="18" fill="#5BBB86" />
        <circle cx="18" cy="44" r="18" fill="#5BBB86" />
      </g>
      <g transform="translate(350 128)">
        <rect x="-6" y="44" width="12" height="62" rx="5" fill="#8F6044" />
        <path d="M0 0 L-34 48 L34 48 Z" fill="#4CA676" />
        <path d="M0 16 L-28 60 L28 60 Z" fill="#5DBB86" opacity="0.85" />
      </g>
      <g transform="translate(610 116)">
        <rect x="-8" y="46" width="16" height="66" rx="6" fill="#99664A" />
        <ellipse cx="0" cy="20" rx="34" ry="44" fill="#4C9C6F" />
        <ellipse cx="-24" cy="48" rx="18" ry="24" fill="#5FB381" />
        <ellipse cx="24" cy="48" rx="18" ry="24" fill="#5FB381" />
      </g>
      <g transform="translate(890 130)">
        <rect x="-5" y="36" width="10" height="58" rx="5" fill="#8F6044" />
        <path d="M0 0 L-26 42 L0 74 L26 42 Z" fill="#54B082" />
      </g>
      <g transform="translate(250 182)">
        <rect x="-2" y="0" width="4" height="36" rx="2" fill="#6DBE84" />
        <g transform="translate(0,-8)">
          <circle cx="0" cy="0" r="9" fill="#FF8BB6" />
          <circle cx="0" cy="-10" r="4" fill="#FFD8E8" />
          <circle cx="8" cy="-2" r="4" fill="#FFD8E8" />
          <circle cx="-8" cy="-2" r="4" fill="#FFD8E8" />
          <circle cx="0" cy="0" r="3" fill="#FFF6FA" />
        </g>
      </g>
      <g transform="translate(520 188)">
        <rect x="-1.5" y="0" width="3" height="30" rx="1.5" fill="#63B778" />
        <g transform="translate(0,-8)">
          <path d="M0 -6 C6 -4 8 4 4 8 C0 12 -6 12 -10 6 C-14 0 -10 -8 0 -6 Z" fill="#FFCE76" />
          <circle cx="0" cy="2" r="3" fill="#F7B84B" />
        </g>
      </g>
      <g transform="translate(760 180)">
        <rect x="-2" y="0" width="4" height="34" rx="2" fill="#63B778" />
        <g transform="translate(0,-7)">
          <circle cx="0" cy="0" r="8" fill="#8AC6FF" />
          <circle cx="0" cy="-8" r="4" fill="#C6E7FF" />
          <circle cx="7" cy="-3" r="4" fill="#C6E7FF" />
          <circle cx="-7" cy="-3" r="4" fill="#C6E7FF" />
          <circle cx="0" cy="0" r="3" fill="#EAF6FF" />
        </g>
      </g>
      <g transform="translate(1030 186)">
        <rect x="-1.5" y="0" width="3" height="32" rx="1.5" fill="#63B778" />
        <g transform="translate(0,-6)">
          <circle cx="0" cy="0" r="7" fill="#FF9F80" />
          <circle cx="0" cy="-7" r="3.5" fill="#FFC9B0" />
          <circle cx="6" cy="-2" r="3.5" fill="#FFC9B0" />
          <circle cx="-6" cy="-2" r="3.5" fill="#FFC9B0" />
          <circle cx="0" cy="0" r="2.5" fill="#FFE6DC" />
        </g>
      </g>
      <g fill="#F2CBB0" opacity="0.5">
        <circle cx="140" cy="70" r="6" />
        <circle cx="280" cy="40" r="4" />
        <circle cx="460" cy="62" r="5" />
        <circle cx="720" cy="48" r="4" />
        <circle cx="840" cy="64" r="6" />
      </g>
    </svg>
  );
}

function SproutAccent({ className = 'h-10 w-full max-w-xs text-primary/70' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 32 C22 20 36 10 52 12 C42 18 30 26 20 32 Z" fill="currentColor" opacity="0.35" />
      <path d="M68 32 C70 18 90 6 112 10 C98 18 84 24 68 32 Z" fill="currentColor" opacity="0.45" />
      <path d="M118 32 C118 22 130 14 144 16 C136 22 128 26 118 32 Z" fill="currentColor" opacity="0.35" />
      <rect x="78" y="12" width="4" height="20" rx="2" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

const FooterShell = withContrast((props: HTMLAttributes<HTMLElement>) => <footer {...props} />, 'surface-2');

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <FooterShell className="relative mt-24 overflow-hidden bg-surface-2">
      <div className="-mb-12">
        <MeadowScene className="h-48 md:h-56" />
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-6 md:pt-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <BrandLogo size={48} className="inline-flex" title="Ìlọ̀ home" />
              <span className="font-serif text-3xl">Ìlọ̀</span>
            </div>
            <p className="max-w-sm text-base opacity-80">
              Playful Yorùbá learning that grows with every child. Stories, songs, and laughter lead the way.
            </p>
            <SproutAccent />
          </div>
          {SECTIONS.map((section) => (
            <div key={section.heading} className="space-y-4">
              <p className="font-title text-lg opacity-90">{section.heading}</p>
              <ul className="space-y-3 text-sm opacity-80">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-sm opacity-80 md:flex-row md:items-center md:justify-between">
          <p>© {year} Ìlọ̀. Sprouting smiles from Lagos to the world.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline">
              Terms
            </Link>
            <Link href="/status" className="transition-colors hover:text-[var(--color-primary)] focus-visible:underline">
              Status
            </Link>
          </div>
        </div>
      </div>
    </FooterShell>
  );
}
