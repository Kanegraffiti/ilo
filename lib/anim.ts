import { MotionProps, Variants, useReducedMotion } from 'framer-motion';

const pageEnterVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const cardPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
};

export const usePageEnter = (): MotionProps => {
  const reduce = useReducedMotion();
  return reduce ? {} : { initial: 'hidden', animate: 'visible', variants: pageEnterVariants };
};

export const useCardPop = (): MotionProps => {
  const reduce = useReducedMotion();
  return reduce ? {} : { initial: 'hidden', animate: 'visible', variants: cardPopVariants };
};

export const usePressable = (): MotionProps => {
  const reduce = useReducedMotion();
  return reduce ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };
};

export const usePulseHint = (): MotionProps => {
  const reduce = useReducedMotion();
  return reduce
    ? {}
    : {
        animate: { scale: [1, 1.03, 1] },
        transition: { duration: 2, repeat: 2, ease: 'easeInOut' },
      };
};
