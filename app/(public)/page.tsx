'use client';

import type { IconName } from '@/components/icons/icons';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

const FEATURES: Array<{ title: string; body: string; icon: IconName }> = [
  {
    title: 'Lessons that feel like play',
    body: 'Ọmọde kọ ẹ̀kọ́ pẹ̀lú fọ́nran, orin, àti ìtàn Ayélújára. Short bursts keep focus and joy.',
    icon: 'books',
  },
  {
    title: 'Quizzes & badges',
    body: 'Earn tortoise shells for each challenge. Immediate feedback says “Ẹ ṣe!” when you nail it.',
    icon: 'party',
  },
  {
    title: 'Culture stories',
    body: 'Hear elders share proverbs and pro-tips about everyday Yorùbá life.',
    icon: 'tortoise',
  },
];

const FAQ = [
  {
    question: 'Can my child learn offline?',
    answer: 'Bẹ́ẹ̀ni! Once a lesson loads we keep it on the device so practice works on the go.',
  },
  {
    question: 'Which ages is Ìlọ̀ for?',
    answer: 'Designed for curious kids 4–12 with gentle guidance for guardians.',
  },
  {
    question: 'Is the Yorùbá accurate?',
    answer: 'Yes—our linguists ensure tones and diacritics stay true to the language.',
  },
];

export default function LandingPage() {
  const pageMotion = usePageEnter();
  return (
    <motion.div {...pageMotion} className="space-y-16 bg-paper c-on-paper">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-6">
          <Chip tone="accent" size="sm">
            Yorùbá made joyful
          </Chip>
          <h1 className="font-title text-4xl text-[var(--on-paper)] md:text-5xl">
            Ìlọ̀: playful Yorùbá adventures for curious minds
          </h1>
          <p className="text-xl text-[var(--on-paper)]/85">
            Build daily habits with songs, stories, and quizzes that celebrate culture. Ìlọ̀ keeps lessons warm, calm, and kid-first—Ẹ jẹ́ ká kọ́ ẹ̀kọ́ papọ̀!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/auth/signup" size="xl" pulse>
              Get started
            </Button>
            <Button href="#faq" variant="ghost" size="xl">
              See how it works
            </Button>
          </div>
        </div>
        <motion.div className="relative flex h-full items-center justify-center rounded-3xl r-xl bg-surface-1 c-on-surface-1 b-border p-8 shadow-md">
          <div className="max-w-sm space-y-4 text-center">
            <p className="text-lg text-[var(--on-surface-1)]/85">“Ẹ̀kọ́ tó dà bí eré ni ó rọrùn láti rántí.”</p>
            <p className="font-title text-3xl text-[var(--on-surface-1)]">“Learning feels like a friendly story time.”</p>
            <span className="text-lg text-[var(--on-surface-1)]/80">— Mama Adé, Lagos</span>
          </div>
        </motion.div>
      </section>

      <section className="bg-paper c-on-paper px-4 py-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-title text-3xl text-[var(--on-paper)] md:text-4xl">Why families choose Ìlọ̀</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} body={feature.body} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <h2 className="font-title text-3xl text-[var(--on-paper)] md:text-4xl">Families feel welcome from day one</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card bodyClassName="space-y-4" header="For guardians">
            <p className="text-[var(--on-surface-1)]/85">
              Track streaks, approve practice, and celebrate wins. Notifications are gentle and respectful.
            </p>
            <ul className="space-y-3 text-[var(--on-surface-1)]/85">
              <li>• Daily check-ins with culturally rooted tips</li>
              <li>• Offline-ready lessons for commutes</li>
              <li>• Profiles for each child 4–12</li>
            </ul>
          </Card>
          <Card bodyClassName="space-y-4" header="For kids">
            <p className="text-[var(--on-surface-1)]/85">
              Short activities keep eyes bright and voices practicing tones with confidence.
            </p>
            <ul className="space-y-3 text-[var(--on-surface-1)]/85">
              <li>• Tap-to-hear Yorùbá words with tone keypad</li>
              <li>• Collect tortoise shells for effort, not just perfection</li>
              <li>• Friendly animations that pause when motion is reduced</li>
            </ul>
          </Card>
        </div>
      </section>

      <section id="faq" className="bg-paper c-on-paper px-4 pb-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="font-title text-3xl text-[var(--on-paper)] md:text-4xl">Questions guardians ask</h2>
          <div className="space-y-4 rounded-2xl r-xl b-border bg-surface-1 c-on-surface-1 p-6 shadow-sm">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl transition-colors hover:bg-[var(--surface-2)] focus-within:bg-[var(--surface-2)]"
              >
                <summary className="cursor-pointer text-xl font-semibold text-[var(--on-surface-1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)]">
                  {item.question}
                </summary>
                <p className="mt-3 text-[var(--on-surface-1)]/85">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
