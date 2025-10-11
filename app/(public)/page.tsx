'use client';

import Icon from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/icons';
import { AnimatedMascots } from '@/components/animated-mascots';
import { FeatureCard } from '@/components/feature-card';
import { PlaceholderImage } from '@/components/placeholder-image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { useCardPop, usePageEnter, usePrefersReducedMotion } from '@/lib/anim';
import { motion } from 'framer-motion';

const HERO_BADGES: Array<{ icon: IconName; label: string }> = [
  { icon: 'play', label: 'Rainbow songs & call-and-response' },
  { icon: 'lesson', label: 'Brain breaks every 3 minutes' },
  { icon: 'shield', label: 'Guardian tips in everyday English' },
];

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

const ADVENTURE_WORLDS = [
  {
    title: 'Tone Garden',
    description: 'Kids tap glowing flowers to hear diacritics bloom and match the right melody.',
    gradient: 'from-[#A8FF78] via-[#78FFD6] to-[#3CA8FF]',
  },
  {
    title: 'Market Dash',
    description: 'Race friendly vendors while learning numbers, bargaining phrases, and greetings.',
    gradient: 'from-[#FFE53B] via-[#FF7A00] to-[#FF1B6B]',
  },
  {
    title: 'Story Treehouse',
    description: 'Choose-your-own-adventure tales with branching Yorùbá dialogue and sound effects.',
    gradient: 'from-[#D8B4FE] via-[#FBC2EB] to-[#A6E3E9]',
  },
  {
    title: 'Drum Lab',
    description: 'Loop beats with talking drum callouts so rhythm and language stick together.',
    gradient: 'from-[#FF9A8B] via-[#FF6A88] to-[#FF99AC]',
  },
];

const JOURNEY = [
  {
    stage: 'Week 1',
    title: 'Sing & point',
    copy: 'Kids explore sound-play missions, copy warm-up words, and earn their first shells.',
  },
  {
    stage: 'Week 2',
    title: 'Speak with friends',
    copy: 'Daily challenges ask learners to record quick phrases and trade voice notes with a mascot.',
  },
  {
    stage: 'Week 4',
    title: 'Share at home',
    copy: 'Family prompts invite everyone to use new phrases at dinner—Ìlọ̀ nudges with gentle reminders.',
  },
  {
    stage: 'Week 6+',
    title: 'Create & remix',
    copy: 'Learners remix chants, tell mini stories, and design stickers that celebrate their wins.',
  },
];

const PLAYFUL_HABITS = [
  {
    title: 'Calming arrival screen',
    body: 'Soft gradients, friendly audio cues, and breathing bubbles help kids settle before a session.',
    footer: 'Auto-adjusts visuals when “reduce motion” is on.',
  },
  {
    title: 'High-five moments',
    body: 'Confetti bursts pulse gently and badges sparkle without overwhelming little eyes.',
    footer: 'Rewards celebrate effort instead of perfect scores.',
  },
  {
    title: 'Parent pause tools',
    body: 'Guardian dashboard suggests conversation starters and toggles screen time limits in one tap.',
    footer: 'Weekly recap email keeps everyone in the loop.',
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
  const cardMotion = useCardPop();
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div {...pageMotion} className="space-y-20 bg-paper c-on-paper pb-20">
      <section className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-[var(--hero-bg-from)] via-[var(--hero-bg-via)] to-[var(--hero-bg-to)]">
        <div className="absolute inset-0" aria-hidden>
          <motion.div
            className="absolute -top-32 left-12 h-64 w-64 rounded-full bg-[var(--hero-glow-1)] blur-[120px]"
            animate={reduced ? undefined : { y: [0, 12, -8, 0] }}
            transition={reduced ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[var(--hero-glow-2)] blur-[140px]"
            animate={reduced ? undefined : { x: [0, -20, 10, 0] }}
            transition={reduced ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:flex-row lg:items-center">
          <div className="space-y-8 text-[var(--on-paper)]">
            <Chip tone="accent" size="sm">
              Yorùbá made joyful
            </Chip>
            <h1 className="font-title text-4xl leading-tight md:text-5xl">
              Ìlọ̀: playful Yorùbá adventures for curious minds
            </h1>
            <p className="max-w-xl text-lg text-[var(--on-paper)]/85 md:text-xl">
              Build daily language habits with songs, stories, and quests that celebrate culture. Every tap in Ìlọ̀ is designed for little hands, bright eyes, and modern attention spans.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/auth/signup" size="xl" pulse>
                Start a free mission
              </Button>
              <Button href="#faq" variant="ghost" size="xl">
                See guardian FAQs
              </Button>
            </div>
            <ul className="flex flex-wrap gap-3 text-sm text-[var(--on-paper)]/80">
              {HERO_BADGES.map((badge) => (
                <li
                  key={badge.label}
                  className="flex items-center gap-2 rounded-full bg-white/40 px-4 py-2 font-medium shadow-sm backdrop-blur"
                >
                  <Icon name={badge.icon} size={18} color="var(--on-paper)" aria-hidden />
                  <span>{badge.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex flex-1 justify-center">
            <PlaceholderImage
              label="Kid explorer dashboard"
              description="Colorful cards show today’s quests, encouraging motions, and gentle reminders."
            />
            <AnimatedMascots className="absolute inset-0" />
            <motion.div
              className="absolute -bottom-6 left-8 rounded-2xl bg-[var(--hero-note-bg)] px-4 py-3 text-sm font-semibold text-[var(--hero-note-color)] shadow-lg"
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={reduced ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              “Ẹ ṣe! New badge unlocked.”
            </motion.div>
            <motion.div
              className="absolute -top-6 right-6 flex items-center gap-2 rounded-2xl bg-[var(--hero-note-bg)] px-4 py-2 text-sm font-semibold text-[var(--hero-note-color)] shadow-lg"
              animate={reduced ? undefined : { y: [0, 6, 0] }}
              transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon name="mic" size={18} color="var(--hero-note-color)" aria-hidden className="shrink-0" />
              Live firefly lesson
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-paper c-on-paper px-4">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-title text-3xl text-[var(--on-paper)] md:text-4xl">Designed for today’s playful learners</h2>
            <p className="text-lg text-[var(--on-paper)]/80">
              Short, interactive missions keep momentum high. Motion, music, and culture cues work together so Yorùbá sticks like a favorite song.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} {...cardMotion}>
                <FeatureCard icon={feature.icon} title={feature.title} body={feature.body} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <h2 className="font-title text-3xl text-[var(--on-paper)] md:text-4xl">Adventure islands spark curiosity</h2>
            <p className="text-lg text-[var(--on-paper)]/80">
              Each world unlocks as learners progress. Sound, color, and motion cues scale gently to keep kids excited without overload.
            </p>
            <ul className="space-y-3 text-[var(--on-paper)]/80">
              <li>• Motion-friendly effects pause automatically if Reduce Motion is on.</li>
              <li>• Every quest includes a cultural “Did you know?” tidbit for families to share.</li>
              <li>• Placeholder scenes swap seamlessly with final art assets.</li>
            </ul>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {ADVENTURE_WORLDS.map((world) => (
              <PlaceholderImage
                key={world.title}
                label={world.title}
                description={world.description}
                gradient={world.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-1 c-on-surface-1 px-4 py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-title text-3xl text-[var(--on-surface-1)] md:text-4xl">A gentle journey that grows with them</h2>
            <p className="text-lg text-[var(--on-surface-1)]/80">
              Guardians see exactly how learning builds over time. Each milestone includes conversation prompts in both Yorùbá and English.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {JOURNEY.map((step) => (
              <motion.article
                key={step.stage}
                className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-6 shadow-sm"
                whileHover={reduced ? undefined : { translateY: -6 }}
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-[var(--on-surface-1)]/70">{step.stage}</span>
                <h3 className="mt-2 font-title text-2xl text-[var(--on-surface-1)]">{step.title}</h3>
                <p className="mt-3 text-[var(--on-surface-1)]/80">{step.copy}</p>
                <motion.div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--color-accent)]/20"
                  animate={reduced ? undefined : { rotate: 360 }}
                  transition={reduced ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }}
                  aria-hidden
                />
              </motion.article>
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

      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <h2 className="font-title text-3xl text-[var(--on-paper)] md:text-4xl">Built-in wellbeing & feedback loops</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {PLAYFUL_HABITS.map((habit) => (
            <Card key={habit.title} bodyClassName="space-y-3" header={habit.title} footer={habit.footer}>
              <p>{habit.body}</p>
            </Card>
          ))}
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
