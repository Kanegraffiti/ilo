'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: 'Lessons that feel like play',
    description: 'Ọmọde kọ́ ẹ̀kọ́ pẹ̀lú fọ́nran, orin, àti ìtàn Ayélujára. Short bursts keep focus and joy.',
    icon: '📚',
  },
  {
    title: 'Quizzes & badges',
    description: 'Earn tortoise shells for each challenge. Immediate feedback says “Ẹ ṣe!” when you nail it.',
    icon: '🎉',
  },
  {
    title: 'Culture stories',
    description: 'Hear elders share proverbs and songs—Ẹ káàárọ̀ to bedtime, the stories stay with you.',
    icon: '🐢',
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
    <motion.div {...pageMotion} className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-6">
          <Chip tone="accent" size="sm">
            Yorùbá made joyful
          </Chip>
          <h1 className="text-4xl font-serif md:text-5xl">Ìlọ̀: playful Yorùbá adventures for curious minds</h1>
          <p className="text-xl text-ink/80">
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
        <motion.div className="relative flex h-full items-center justify-center rounded-3xl bg-secondary/10 p-8 shadow-md">
          <div className="max-w-sm space-y-4 text-center">
            <p className="text-lg text-ink/70">“Ẹ̀kọ́ tó dà bí eré ni ó rọrùn láti rántí.”</p>
            <p className="text-3xl font-serif">“Learning feels like a friendly story time.”</p>
            <span className="text-lg text-ink/60">— Mama Adé, Lagos</span>
          </div>
        </motion.div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-serif">Why families choose Ìlọ̀</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="h-full border border-ink/10 bg-white/80 dark:border-ink/25 dark:bg-surface/80"
              bodyClassName="space-y-3"
              header={
                <span className="flex items-center gap-3 text-xl font-serif">
                  <span aria-hidden="true" className="text-3xl">
                    {feature.icon}
                  </span>
                  {feature.title}
                </span>
              }
            >
              <p className="text-lg text-ink/80 dark:text-ink">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-serif">Families feel welcome from day one</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            className="border border-ink/10 bg-white/80 dark:border-ink/25 dark:bg-surface/80"
            bodyClassName="space-y-4"
            header={<span className="text-xl font-serif">For guardians</span>}
          >
            <p className="text-lg text-ink/80 dark:text-ink">
              Track streaks, approve practice, and celebrate wins. Notifications are gentle and respectful.
            </p>
            <ul className="space-y-3 text-lg text-ink/80 dark:text-ink">
              <li>• Daily check-ins with culturally rooted tips</li>
              <li>• Offline-ready lessons for commutes</li>
              <li>• Profiles for each child 4–12</li>
            </ul>
          </Card>
          <Card
            className="border border-ink/10 bg-white/80 dark:border-ink/25 dark:bg-surface/80"
            bodyClassName="space-y-4"
            header={<span className="text-xl font-serif">For kids</span>}
          >
            <p className="text-lg text-ink/80 dark:text-ink">
              Short activities keep eyes bright and voices practicing tones with confidence.
            </p>
            <ul className="space-y-3 text-lg text-ink/80 dark:text-ink">
              <li>• Tap-to-hear Yorùbá words with tone keypad</li>
              <li>• Collect tortoise shells for effort, not just perfection</li>
              <li>• Friendly animations that pause when motion is reduced</li>
            </ul>
          </Card>
        </div>
      </section>

      <section id="faq" className="space-y-6">
        <h2 className="text-3xl font-serif">Questions guardians ask</h2>
        <div className="space-y-4 rounded-2xl border border-ink/10 bg-white/80 p-6 dark:border-ink/25 dark:bg-surface/80">
          {FAQ.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-transparent p-4 transition hover:border-primary/30">
              <summary className="cursor-pointer text-xl font-semibold text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40">
                {item.question}
              </summary>
              <p className="mt-3 text-lg text-ink/80 dark:text-ink">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
