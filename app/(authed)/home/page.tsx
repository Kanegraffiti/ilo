'use client';

import Icon from '@/components/icons/Icon';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { usePageEnter } from '@/lib/anim';
import { formatInTz } from '@/lib/tz';
import { motion } from 'framer-motion';

const LIVE_SESSION = {
  title: 'Ọ̀rọ̀ Ayá ìtàn – live story circle',
  start: new Date(Date.now() + 1000 * 60 * 60 * 20),
  mentor: 'Tànná the storyteller',
};

export default function HomePage() {
  const pageMotion = usePageEnter();
  return (
    <motion.div {...pageMotion} className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card
          className="border border-ink/10 bg-white/85"
          bodyClassName="space-y-6"
          header={<h2 className="text-3xl font-serif">Continue “Ẹ káàárọ̀ greetings”</h2>}
          footer={<ProgressBar value={65} label="Lesson progress" />}
        >
          <p className="text-xl text-ink/70">
            You stopped at the tone practice mini-game. Tap resume and say each greeting slowly with the tone keypad.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/lessons/intro" size="lg">
              Resume lesson
            </Button>
            <Button href="/practice/welcome" variant="ghost" size="lg">
              Jump to practice
            </Button>
          </div>
        </Card>
        <Card
          className="border border-ink/10 bg-secondary/10"
          bodyClassName="flex flex-col items-center justify-center gap-4"
          header={<span className="text-2xl font-serif">Streak tracker</span>}
        >
          <ProgressRing value={82} label="Goal" />
          <Chip tone="accent" size="md">
            <Icon name="star" size={16} color="var(--on-accent)" className="shrink-0" aria-hidden />
            12-day streak
          </Chip>
          <p className="text-center text-lg text-ink/70">Only 8 minutes left to meet today’s goal. Ẹ má ṣe ṣiyemeji!</p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card
          className="border border-ink/10 bg-white/85"
          bodyClassName="space-y-3"
          header={<span className="text-2xl font-serif">Fun fact of the week</span>}
        >
          <p className="text-xl text-ink/70">
            In Yorùbá, tone can change meaning completely—“ọ̀rẹ́” means friend while “ọrẹ́” means gift. Practice both with a smile.
          </p>
        </Card>
        <Card
          className="border border-ink/10 bg-white/85"
          bodyClassName="space-y-4"
          header={<span className="text-2xl font-serif">Next live session</span>}
        >
          <p className="text-lg text-ink/70">{LIVE_SESSION.title}</p>
          <p className="text-lg text-ink/80">Mentor: {LIVE_SESSION.mentor}</p>
          <p className="text-lg font-semibold text-primary">{formatInTz(LIVE_SESSION.start)}</p>
          <Button href="/practice/welcome" variant="secondary" size="md">
            Add to calendar
          </Button>
        </Card>
      </section>
    </motion.div>
  );
}
