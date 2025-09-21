'use client';

import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/anim';

export type MascotWaveProps = {
  className?: string;
} & Omit<ComponentProps<'svg'>, 'className'>;

export default function MascotWave({ className, ...props }: MascotWaveProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn('h-8 w-8', className)}
      animate={
        !reduced
          ? {
              rotate: [0, 3, 0, -2, 0],
              y: [0, -1.5, 0, -1.5, 0],
            }
          : undefined
      }
      transition={!reduced ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      {...props}
    >
      <defs>
        <linearGradient id="shell" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.95} />
          <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <g transform="translate(16 18)">
        <ellipse cx="0" cy="10" rx="12" ry="6" fill="rgba(0,0,0,0.08)" />
      </g>
      <g>
        <path
          d="M8 16c0-5.8 4.7-10.5 10.5-10.5 5.8 0 10.5 4.7 10.5 10.5 0 5-3.6 8.7-9.8 9.8-4.2.8-9.2-2.6-11.1-5.9C6.3 18.6 7.4 16.7 8 16z"
          fill="url(#shell)"
        />
        <path
          d="M8.5 15.5c-1-3 1.6-7.5 6.8-9.2 5.2-1.7 9.5.9 10.9 3.1-4.2-1-7.4-.6-9.7.6-2.4 1.2-4.2 3.3-5.1 5.5-.5 1.2-1.7 1.5-2.9 0z"
          fill="var(--surface-2)"
          opacity={0.35}
        />
        <path
          d="M9 19c.6-2 2.2-3.8 4.8-4.5 2.7-.8 5.4.2 7.2 1.7 1.8 1.6 2.3 4 1.1 5.5-1.2 1.5-3.7 2-6 1.4-2.4-.5-4.9-2.2-7.1-4.1z"
          fill="var(--surface-2)"
          opacity={0.4}
        />
        <path
          d="M14.5 13.3c0-2.3 1.9-4.2 4.2-4.2s4.2 1.9 4.2 4.2c0 2.3-1.9 4.2-4.2 4.2s-4.2-1.9-4.2-4.2z"
          fill="var(--surface-1)"
        />
        <circle cx="18" cy="13" r="1.4" fill="var(--on-surface-1)" />
        <path
          d="M16 17c1.6.8 3.4.8 5 0 .5-.3 1.2.2.9.7-.7 1.1-2 1.8-3.4 1.8s-2.7-.7-3.4-1.8c-.3-.5.4-1 .9-.7z"
          fill="var(--on-surface-1)"
          opacity={0.65}
        />
        <path
          d="M23.3 12.2c.6-.5 1.5-.5 2.1.1.6.6.7 1.6.2 2.3-.4.6-1.1 1-1.8 1.1-.8.1-1.5-.3-1.8-1-.3-.7 0-1.5.6-1.9l.7-.6z"
          fill="var(--color-accent)"
        />
        <path
          d="M9.2 14.8c-.8-.4-1.8-.1-2.2.7-.4.8-.1 1.8.7 2.2.8.4 1.8.1 2.2-.7.4-.8.1-1.8-.7-2.2z"
          fill="var(--color-secondary)"
        />
      </g>
    </motion.svg>
  );
}
