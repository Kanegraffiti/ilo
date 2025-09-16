'use client';

import { MotionProps, Variants } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const pageEnterVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const cardPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    const mediaQueryList = window.matchMedia(REDUCE_MOTION_QUERY);
    setPrefersReducedMotion(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

export function usePageEnter(): MotionProps {
  const reduced = usePrefersReducedMotion();
  return useMemo<MotionProps>(() => {
    if (reduced) {
      return {};
    }

    return {
      initial: 'hidden',
      animate: 'visible',
      exit: 'hidden',
      variants: pageEnterVariants,
    } satisfies MotionProps;
  }, [reduced]);
}

export function useCardPop(): MotionProps {
  const reduced = usePrefersReducedMotion();
  return useMemo<MotionProps>(() => {
    if (reduced) {
      return {};
    }

    return {
      initial: 'hidden',
      animate: 'visible',
      exit: 'hidden',
      variants: cardPopVariants,
    } satisfies MotionProps;
  }, [reduced]);
}

export function usePressable(): MotionProps {
  const reduced = usePrefersReducedMotion();
  return useMemo<MotionProps>(() => {
    if (reduced) {
      return {};
    }

    return {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    } satisfies MotionProps;
  }, [reduced]);
}

export function usePulseHint(): MotionProps {
  const reduced = usePrefersReducedMotion();
  return useMemo<MotionProps>(() => {
    if (reduced) {
      return {};
    }

    return {
      animate: { scale: [1, 1.06, 1] },
      transition: { duration: 1.4, repeat: 2, ease: 'easeInOut' },
    } satisfies MotionProps;
  }, [reduced]);
}

export { pageEnterVariants as pageEnter, cardPopVariants as cardPop };
