'use client';

import { motion } from 'framer-motion';

import { usePrefersReducedMotion } from '@/lib/anim';
import { cn } from '@/lib/utils';

interface AnimatedMascotsProps {
  className?: string;
}

export function AnimatedMascots({ className }: AnimatedMascotsProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className={cn('pointer-events-none select-none', className)} aria-hidden>
      <motion.svg
        viewBox="0 0 120 120"
        className="absolute -left-6 top-8 z-20 h-28 w-28 [filter:drop-shadow(0_16px_28px_rgba(0,0,0,0.18))]"
        animate={
          reduced
            ? undefined
            : {
                y: [0, -12, 0],
                rotate: [0, -4, 4, 0],
              }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <rect x="14" y="36" width="92" height="58" rx="28" fill="#7CC76B" />
        <path
          d="M28 70c8 10 24 16 32 16s24-6 32-16"
          stroke="#4A913F"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="40" cy="60" rx="10" ry="12" fill="#F9F1D7" />
        <ellipse cx="80" cy="60" rx="10" ry="12" fill="#F9F1D7" />
        <circle cx="40" cy="60" r="4" fill="#2C221B" />
        <circle cx="80" cy="60" r="4" fill="#2C221B" />
        <path d="M56 80c4 3 12 3 16 0" stroke="#2C221B" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M18 70c-6 0-10-6-10-12s4-12 10-12" fill="#6AB05A" />
        <path d="M102 70c6 0 10-6 10-12s-4-12-10-12" fill="#6AB05A" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 120 120"
        className="absolute -right-4 bottom-4 z-20 h-32 w-32 [filter:drop-shadow(0_18px_32px_rgba(0,0,0,0.2))]"
        animate={
          reduced
            ? undefined
            : {
                y: [0, 10, 0],
                rotate: [0, 6, -6, 0],
              }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <ellipse cx="60" cy="76" rx="26" ry="22" fill="#FFCF6B" />
        <path d="M36 70c6-14 18-24 24-24s18 10 24 24" fill="#FFE7A6" />
        <path d="M52 88c4 2 12 2 16 0" stroke="#BA6A2D" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="46" cy="64" r="6" fill="#2C221B" />
        <circle cx="74" cy="64" r="6" fill="#2C221B" />
        <circle cx="46" cy="64" r="2" fill="#F8F4E8" />
        <circle cx="74" cy="64" r="2" fill="#F8F4E8" />
        <path d="M60 24c-6 8-6 22-6 30s4 16 6 16 6-8 6-16-0-22-6-30z" fill="#7DC3FF" />
        <path d="M44 32c6 0 10 6 16 6s10-6 16-6" stroke="#2C221B" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="92" r="10" fill="#7DC3FF" />
        <circle cx="90" cy="92" r="10" fill="#7DC3FF" />
      </motion.svg>
    </div>
  );
}
