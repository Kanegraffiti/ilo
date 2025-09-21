"use client";

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { usePageEnter } from '@/lib/anim';

const highlights = [
  {
    title: 'Lessons kids love',
    description: 'Story-led modules spark curiosity with songs, chants, and family dialogues.',
  },
  {
    title: 'Practice anywhere',
    description: 'Tone keypad drills and offline notes keep pronunciation sharp even without Wi-Fi.',
  },
  {
    title: 'Celebrate progress',
    description: 'Collect badges and share proverb streaks that honour Yorùbá culture.',
  },
];

export default function LandingPage() {
  const page = usePageEnter();

  return (
    <motion.div
      {...page}
      className="flex flex-col gap-12 rounded-3xl bg-paper c-on-paper p-6 md:p-10"
    >
      <section className="grid gap-10 rounded-3xl bg-surface-1 c-on-surface-1 p-10 shadow-xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <span className="rounded-full bg-surface-2 c-on-surface-2 px-4 py-1 text-sm font-semibold uppercase tracking-wide">
            Yorùbá for families
          </span>
          <h1 className="text-4xl font-serif leading-tight md:text-5xl">Learn Yoruba with Ìlọ̀</h1>
          <p className="max-w-2xl text-lg leading-relaxed opacity-90">
            Build confident speakers with playful lessons, tonal practice, and culture-forward stories crafted for children and guardians.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:justify-start">
            <Button href="/auth/signup" size="xl">
              Get Started
            </Button>
            <Button href="/facts" variant="ghost" size="lg">
              Explore fun facts
            </Button>
          </div>
        </div>
        <Card className="bg-surface-2 c-on-surface-2 shadow-none" bodyClassName="space-y-4">
          <h2 className="text-2xl font-serif">Always contrast-safe</h2>
          <p className="opacity-90">
            Ìlọ̀ automatically pairs every background with its matching on-color so that text and controls stay readable in light or dark themes.
          </p>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-1 text-xl">
                🐢
              </span>
              <span className="opacity-90">Install the PWA to keep lessons cached for offline adventures.</span>
            </li>
            <li className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-1 text-xl">
                🎧
              </span>
              <span className="opacity-90">Hear native audio and record your own greetings with the tone keypad.</span>
            </li>
          </ul>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} bodyClassName="space-y-3">
            <h2 className="text-2xl font-serif">{item.title}</h2>
            <p className="text-base opacity-80">{item.description}</p>
          </Card>
        ))}
      </section>
    </motion.div>
  );
}
