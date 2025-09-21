'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useMemo, useState, type ComponentType } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCardPop, usePrefersReducedMotion } from '@/lib/anim';
import type { FooterModel, FooterProgress } from '@/lib/footerContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

type MascotComponent = ComponentType<{ className?: string }>;

export interface GreetingBarProps {
  greeting: string;
  childName?: string;
  Mascot: MascotComponent;
}

export function GreetingBar({ greeting, childName, Mascot }: GreetingBarProps) {
  const welcomeLine = childName ? `${greeting} ${childName}` : `${greeting}`;

  return (
    <div className="flex min-h-[64px] flex-wrap items-center gap-4 rounded-3xl bg-surface-2 p-4 c-on-surface-2">
      <div className="flex items-center gap-3">
        <Mascot className="h-10 w-10" />
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--on-surface-2)]/70">Friendly tortoise</p>
          <p className="text-2xl font-serif leading-snug">{welcomeLine} <span aria-hidden="true">👋</span></p>
        </div>
      </div>
      <p className="text-base text-[var(--on-surface-2)]/80">
        Keep your Yorùbá warm with a quick smile and a new word every day.
      </p>
    </div>
  );
}

export function PrimaryCta({ cta }: { cta?: FooterModel['primaryCta'] }) {
  const reduced = usePrefersReducedMotion();
  const cardMotion = useCardPop();

  return (
    <motion.div
      className="rounded-3xl bg-surface-2 p-4 c-on-surface-2"
      {...(!reduced ? cardMotion : {})}
    >
      <div className="space-y-3">
        <p className="text-base text-[var(--on-surface-2)]/75">
          Ready for a playful boost? Tap the big button below to keep learning.
        </p>
        {cta ? (
          <Button href={cta.href} size="xl" className="w-full justify-between">
            <span className="flex items-center gap-2">
              {cta.icon ? (
                <span aria-hidden="true" className="text-2xl">
                  {cta.icon}
                </span>
              ) : null}
              <span>{cta.label}</span>
            </span>
            <span aria-hidden="true">→</span>
          </Button>
        ) : (
          <div className="flex min-h-[56px] items-center justify-center rounded-2xl border border-dashed border-[var(--on-surface-2)]/25 px-4 text-lg text-[var(--on-surface-2)]/70">
            Stay tuned for your next adventure!
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function FunFactCard({ data }: { data?: FooterModel['funFact'] }) {
  const reduced = usePrefersReducedMotion();
  const cardMotion = useCardPop();

  return (
    <motion.div
      className="flex h-full flex-col justify-between rounded-3xl bg-surface-2 p-4 c-on-surface-2"
      {...(!reduced ? cardMotion : {})}
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--on-surface-2)]/70">Fun fact corner</p>
        <h3 className="text-2xl font-serif leading-tight">
          {data?.title ?? 'Stories from Ìjàpá the tortoise'}
        </h3>
        <p className="text-base text-[var(--on-surface-2)]/75">
          {data?.teaser ?? 'Peek into Yorùbá culture with tiny facts that spark big smiles.'}
        </p>
      </div>
      <div className="pt-4">
        <Link
          href={data?.href ?? '/facts'}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-lg font-semibold c-on-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-2)]"
        >
          Read the full fact
          <span aria-hidden="true">🌿</span>
        </Link>
      </div>
    </motion.div>
  );
}

export function NextLessonCard({
  data,
  progress,
}: {
  data: FooterModel['nextLesson'];
  progress?: FooterProgress | null;
}) {
  const reduced = usePrefersReducedMotion();
  const cardMotion = useCardPop();
  const streakText = useMemo(() => {
    if (!progress?.streakDays || progress.streakDays <= 0) {
      return undefined;
    }
    if (progress.streakDays === 1) {
      return '1-day streak — keep it up!';
    }
    return `${progress.streakDays}-day streak — ẹ ṣe!`;
  }, [progress?.streakDays]);

  const scoreBadge = typeof progress?.lastScore === 'number' ? progress.lastScore : undefined;

  return (
    <motion.div
      className="flex h-full flex-col justify-between rounded-3xl bg-surface-2 p-4 c-on-surface-2"
      {...(!reduced ? cardMotion : {})}
    >
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--on-surface-2)]/70">Next up</p>
        <h3 className="text-2xl font-serif leading-tight">{data?.title ?? 'More lessons coming soon'}</h3>
        {streakText ? (
          <span className="inline-flex min-h-[32px] items-center justify-center rounded-full bg-secondary px-3 text-sm font-semibold c-on-secondary">
            {streakText}
          </span>
        ) : null}
        {typeof scoreBadge === 'number' ? (
          <span className="inline-flex min-h-[32px] items-center justify-center rounded-full bg-primary/10 px-3 text-sm font-semibold text-[var(--on-surface-2)]">
            Last quiz: {scoreBadge}%
          </span>
        ) : null}
        <p className="text-base text-[var(--on-surface-2)]/75">
          Jump back in for a quick burst of Yorùbá practice. Tiny repeats build big confidence.
        </p>
      </div>
      <div className="pt-4">
        <Button href={data?.href ?? '/lessons/intro'} size="xl" className="w-full justify-between">
          <span>Go to lesson</span>
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </motion.div>
  );
}

export function QuickNav({ links }: { links: FooterModel['secondaryLinks'] }) {
  return (
    <nav aria-label="Quick links" className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--on-surface-1)]/70">Quick hop</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex min-h-[48px] items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 text-lg font-semibold text-[var(--on-surface-2)] transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-2)]"
            >
              <span>{link.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function NewsletterMini() {
  const { push } = useToast();
  const reduced = usePrefersReducedMotion();
  const cardMotion = useCardPop();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'neutral' | 'success' | 'error'>('neutral');

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submitting) return;

      const trimmed = email.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(trimmed)) {
        setTone('error');
        setMessage('Please enter a valid email address.');
        return;
      }

      setSubmitting(true);
      setTone('neutral');
      setMessage('Sending…');

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        setEmail('');
        setTone('success');
        setMessage('Ẹ ṣe! Check your inbox for a warm welcome.');
        push({
          title: 'Newsletter subscribed',
          description: 'Ẹ káàbọ̀! We will send cosy Yorùbá tips soon.',
          tone: 'success',
        });
      } catch (error) {
        console.error('[footer] newsletter subscribe failed', error);
        setTone('error');
        setMessage('We could not save that right now. Try again once you are online.');
        push({
          title: 'Try again later',
          description: 'We could not reach the tortoise desk. Check your connection and retry.',
          tone: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [email, push, submitting],
  );

  return (
    <motion.div
      className="rounded-3xl bg-surface-2 p-4 c-on-surface-2"
      {...(!reduced ? cardMotion : {})}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--on-surface-2)]/70">Guardian newsletter</p>
          <h3 className="text-2xl font-serif leading-tight">Tips that sparkle at bedtime</h3>
          <p className="text-base text-[var(--on-surface-2)]/75">
            Get quick prompts and pronunciation games to share with your little learner.
          </p>
        </div>
        <Input
          type="email"
          label="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="md" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send me smiles'}
          </Button>
        </div>
        <p
          role="status"
          aria-live="polite"
          className={cn('text-sm', tone === 'error' ? 'text-[#d24b4b]' : 'text-[var(--on-surface-2)]/70')}
        >
          {message}
        </p>
      </form>
    </motion.div>
  );
}

export function LegalRow() {
  return (
    <div className="space-y-2 rounded-3xl bg-surface-2 p-4 text-sm c-on-surface-2">
      <p className="text-[var(--on-surface-2)]/80">© Ìlọ̀ {new Date().getFullYear()} • Growing Yorùbá joyfully.</p>
      <div className="flex flex-wrap gap-4 text-[var(--on-surface-2)]">
        <Link
          href="/legal/privacy"
          className="underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-2)] hover:underline"
        >
          Privacy
        </Link>
        <Link
          href="/legal/terms"
          className="underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-2)] hover:underline"
        >
          Terms
        </Link>
        <Link
          href="/help"
          className="underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-2)] hover:underline"
        >
          Help
        </Link>
      </div>
    </div>
  );
}

export interface StatusPillsProps {
  offline?: boolean;
  showInstall?: boolean;
  onInstallClick?: () => void;
  installHref?: string;
}

export function StatusPills({ offline, showInstall, onInstallClick, installHref = '/install' }: StatusPillsProps) {
  if (!offline && !showInstall) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" aria-live="polite">
      {offline ? (
        <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-secondary px-4 text-sm font-semibold c-on-secondary">
          <span aria-hidden="true">📡</span>
          Offline — changes will sync
        </span>
      ) : null}
      {showInstall ? (
        onInstallClick ? (
          <button
            type="button"
            onClick={onInstallClick}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold c-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)]"
          >
            <span aria-hidden="true">📲</span>
            Install Ìlọ̀
          </button>
        ) : (
          <Link
            href={installHref}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold c-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)]"
          >
            <span aria-hidden="true">📲</span>
            Install Ìlọ̀
          </Link>
        )
      ) : null}
    </div>
  );
}
