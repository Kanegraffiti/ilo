'use client';

import { useCardPop } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const headerToneMap = {
  primary: 'bg-primary c-on-primary',
  secondary: 'bg-secondary c-on-secondary',
  accent: 'bg-accent c-on-accent',
} as const;

type HeaderTone = keyof typeof headerToneMap;

export interface AuthCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerTone?: HeaderTone;
}

export function AuthCard({
  title,
  description,
  icon,
  eyebrow,
  action,
  children,
  className,
  headerTone = 'secondary',
}: AuthCardProps) {
  const motionProps = useCardPop();

  return (
    <motion.article
      {...motionProps}
      className={cn('overflow-hidden rounded-3xl bg-surface shadow-md ring-1 ring-[color:var(--color-on-surface)]/5', className)}
    >
      {icon || eyebrow ? (
        <div className={cn('flex items-center gap-3 px-6 py-4', headerToneMap[headerTone])}>
          {icon ? (
            <span aria-hidden="true" className="text-2xl">
              {icon}
            </span>
          ) : null}
          {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide">{eyebrow}</p> : null}
        </div>
      ) : null}
      <div className="space-y-6 px-6 pb-8 pt-7 c-on-surface">
        <div className="space-y-3">
          <h2 className="text-3xl font-serif leading-tight">{title}</h2>
          {description ? <p className="text-lg leading-relaxed">{description}</p> : null}
        </div>
        {children ? <div className="space-y-6">{children}</div> : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </motion.article>
  );
}
