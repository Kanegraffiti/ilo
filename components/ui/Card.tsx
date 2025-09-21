'use client';

import { useCardPop } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  header?: ReactNode;
  footer?: ReactNode;
  as?: 'section' | 'article' | 'div';
  bodyClassName?: string;
}

export function Card({
  header,
  footer,
  children,
  className,
  bodyClassName,
  as: Tag = 'section',
  ...props
}: CardProps) {
  const motionProps = useCardPop();
  const MotionComponent =
    {
      section: motion.section,
      article: motion.article,
      div: motion.div,
    }[Tag];

  return (
    <MotionComponent
      {...(motionProps as Record<string, unknown>)}
      {...(props as Record<string, unknown>)}
      className={cn(
        'flex h-full flex-col rounded-2xl r-xl b-border bg-surface-1 c-on-surface-1 p-0 shadow-md backdrop-blur-sm transition-colors hover:bg-[var(--surface-3)] focus-within:ring-4 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--paper)]',
        className,
      )}
    >
      {header ? (
        <div className="px-6 pt-6 pb-3 font-title text-xl text-[var(--on-surface-1)] md:text-2xl">
          {header}
        </div>
      ) : null}
      <div className={cn('flex-1 px-6 pb-6 text-[var(--on-surface-1)]/85', bodyClassName)}>{children}</div>
      {footer ? <div className="px-6 pb-6 pt-3 text-[var(--on-surface-1)]/80">{footer}</div> : null}
    </MotionComponent>
  );
}
