'use client';

import Icon from '@/components/icons/Icon';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { usePrefersReducedMotion } from '@/lib/anim';

interface PlaceholderImageProps {
  label: string;
  description?: string;
  gradient?: string;
  className?: string;
}

const DEFAULT_GRADIENT = 'from-[#FFE27D] via-[#FF8FB1] to-[#7CD9FF]';

export function PlaceholderImage({
  label,
  description,
  gradient = DEFAULT_GRADIENT,
  className,
}: PlaceholderImageProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      role="img"
      aria-label={description ? `${label}. ${description}` : label}
      className={clsx(
        'relative isolate flex aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-gradient-to-br p-6 text-left shadow-xl',
        gradient,
        className,
      )}
      animate={reduced ? undefined : { y: [0, -10, 0] }}
      transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute -top-8 left-4 h-36 w-36 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute bottom-6 right-8 h-32 w-32 rounded-full bg-white/50 blur-xl" />
        <div className="absolute top-16 right-16 h-28 w-28 rotate-45 rounded-3xl bg-white/30 blur-lg" />
      </div>
      <div className="relative z-10 flex flex-col gap-2">
        <span className="inline-flex max-w-max rounded-full bg-black/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-black/70">
          concept art
        </span>
        <p className="text-2xl font-semibold text-black drop-shadow-sm">{label}</p>
        {description ? <p className="max-w-xs text-base text-black/70">{description}</p> : null}
      </div>
      <motion.div
        className="absolute bottom-4 right-4 grid h-16 w-16 place-items-center rounded-3xl bg-white/80 text-lg font-bold text-black shadow-sm"
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, -6, 6, -2, 0],
              }
        }
        transition={reduced ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        <Icon name="star" size={32} color="#111" />
      </motion.div>
    </motion.div>
  );
}
