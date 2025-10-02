'use client';

import { useCardPop, usePressable } from '@/lib/anim';
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface CohortSummary {
  id: string;
  name: string;
  description?: string | null;
  studentCount?: number;
  progressAverage?: number | null;
}

interface CohortListProps {
  cohorts: CohortSummary[];
  hrefBase?: string;
  emptyState?: React.ReactNode;
}

export function CohortList({ cohorts, hrefBase = '/teacher/cohorts', emptyState }: CohortListProps) {
  const cardPop = useCardPop();
  const pressable = usePressable();

  if (cohorts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/10 bg-surface-50/90 p-6 text-center text-sm text-ink/70">
        {emptyState ?? 'No cohorts yet. Create one to invite learners.'}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cohorts.map((cohort) => (
        <motion.article
          key={cohort.id}
          {...cardPop}
          className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white/90 p-5 shadow-sm"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-serif text-ink">{cohort.name}</h3>
            {cohort.description ? <p className="text-sm text-ink/70">{cohort.description}</p> : null}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-ink/60">
            <span>{cohort.studentCount ?? 0} learners</span>
            {typeof cohort.progressAverage === 'number' ? <span>{Math.round(cohort.progressAverage)}% avg progress</span> : null}
          </div>
          <motion.div {...pressable} className="mt-4">
            <Link
              href={`${hrefBase}/${cohort.id}`}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-on-primary shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
            >
              Open cohort
            </Link>
          </motion.div>
        </motion.article>
      ))}
    </div>
  );
}
