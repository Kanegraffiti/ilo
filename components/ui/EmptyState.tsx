'use client';

import { useCardPop } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const motionProps = useCardPop();

  return (
    <motion.div
      {...motionProps}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--border)] bg-paper c-on-paper px-6 py-12 text-center shadow-sm',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {icon ? (
        <div className="text-4xl" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className="text-2xl font-serif">{title}</h3>
      {description ? <p className="max-w-md text-lg opacity-80">{description}</p> : null}
      {action}
    </motion.div>
  );
}
