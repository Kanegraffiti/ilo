"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useAnalytics } from '@/lib/analytics';

interface Props {
  title: string;
  tagline: string;
  bullets: string[];
}

export default function Hero({ title, tagline, bullets }: Props) {
  const { track } = useAnalytics();
  return (
    <section className="relative hero overflow-hidden py-12">
      {/* decorative background */}
      <div aria-hidden className="absolute inset-0 gradient pointer-events-none -z-10" />
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* content */}
        <div className="flex-1 text-center md:text-left space-y-6 relative z-10 content">
          <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
          <p className="text-lg">{tagline}</p>
          <ul className="flex justify-center md:justify-start gap-4 text-sm">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="flex gap-4 justify-center md:justify-start mt-4">
            <Link
              href="/features"
              className="px-5 py-3 rounded-xl bg-amber-700 text-white focus:outline-none focus:ring"
              onClick={() => track('cta_features')}
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="px-5 py-3 rounded-xl border border-amber-700 focus:outline-none focus:ring"
              onClick={() => track('cta_pricing')}
            >
              See Plans
            </Link>
          </div>
        </div>
        <div className="flex-1 relative w-full h-64 md:h-96 pointer-events-none select-none -z-10 md:z-0">
          <Image src="/images/mockups/screen1.svg" alt="App screen" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}
