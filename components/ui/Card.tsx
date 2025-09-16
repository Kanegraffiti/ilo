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
        'flex h-full flex-col rounded-2xl border border-ink/5 bg-paper/95 p-0 shadow-md backdrop-blur-sm focus-within:ring-4 focus-within:ring-accent/30',
        className,
      )}
    >
      {header ? <div className="px-6 pt-6 pb-3 text-lg font-serif text-ink">{header}</div> : null}
      <div className={cn('flex-1 px-6 pb-6 text-ink', bodyClassName)}>{children}</div>
      {footer ? <div className="px-6 pb-6 pt-3 text-ink/80">{footer}</div> : null}
    </MotionComponent>
  );
}
