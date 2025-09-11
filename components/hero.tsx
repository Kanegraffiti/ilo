"use client";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/lib/analytics';

interface Props {
  title: string;
  tagline: string;
  bullets: string[];
}

export default function Hero({ title, tagline, bullets }: Props) {
  const { track } = useAnalytics();
  return (
    <section className="container mx-auto flex flex-col md:flex-row items-center gap-8 py-12">
      <div className="flex-1 text-center md:text-left space-y-6">
        <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
        <p className="text-lg">{tagline}</p>
        <ul className="flex justify-center md:justify-start gap-4 text-sm">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="flex gap-4 justify-center md:justify-start">
          <Button onClick={() => track('start_lesson')}>Start free lesson</Button>
          <Button variant="secondary" onClick={() => track('cta_whatsapp')}>
            <a href="https://wa.me/234000000000">Message us on WhatsApp</a>
          </Button>
        </div>
      </div>
      <div className="flex-1 relative w-full h-64 md:h-96">
        <Image src="/images/mockups/screen1.svg" alt="App screen" fill className="object-contain" />
      </div>
    </section>
  );
}
