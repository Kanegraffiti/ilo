'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import { usePrefersReducedMotion } from '@/lib/anim';
import { cn } from '@/lib/utils';

type FloatingCutoutSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS_MAP: Record<FloatingCutoutSize, string> = {
  sm: 'h-28 w-28 md:h-32 md:w-32',
  md: 'h-36 w-36 md:h-40 md:w-40',
  lg: 'h-40 w-40 md:h-48 md:w-48',
};

export interface FloatingCutoutProps {
  src: string;
  alt: string;
  className?: string;
  size?: FloatingCutoutSize;
  floatDirection?: 'up' | 'down';
  floatIntensity?: number;
  rotate?: number;
  delay?: number;
  priority?: boolean;
  ariaHidden?: boolean;
}

export function FloatingCutout({
  src,
  alt,
  className,
  size = 'md',
  floatDirection = 'up',
  floatIntensity = 14,
  rotate = 5,
  delay = 0,
  priority,
  ariaHidden,
}: FloatingCutoutProps) {
  const reduced = usePrefersReducedMotion();

  const animate = reduced
    ? undefined
    : {
        y: floatDirection === 'down' ? [0, floatIntensity, 0] : [0, -floatIntensity, 0],
        rotate: rotate ? [0, rotate, -rotate, 0] : undefined,
      };

  const transition = reduced
    ? undefined
    : {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        delay,
      };

  return (
    <motion.div
      className={cn('pointer-events-none select-none', className)}
      animate={animate}
      transition={transition}
      aria-hidden={ariaHidden || undefined}
    >
      <div
        className={cn(
          'relative overflow-visible rounded-[2.5rem] bg-white/40 p-4 shadow-[0_18px_40px_rgba(53,40,26,0.14)] backdrop-blur-sm',
          SIZE_CLASS_MAP[size],
          'before:absolute before:inset-2 before:-z-10 before:rounded-[2rem] before:bg-white/40 before:shadow-[0_0_35px_rgba(112,168,122,0.28)]',
        )}
      >
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={ariaHidden ? '' : alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 220px, (min-width: 768px) 180px, 140px"
            className="object-contain drop-shadow-[0_18px_34px_rgba(35,51,31,0.18)]"
          />
        </div>
      </div>
    </motion.div>
  );
}

