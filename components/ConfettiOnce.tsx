'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ConfettiOnceProps {
  trigger?: boolean;
}

export default function ConfettiOnce({ trigger = true }: ConfettiOnceProps) {
  const [show, setShow] = useState(trigger);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 flex items-center justify-center text-6xl"
        >
          🎉
        </motion.div>
      )}
    </AnimatePresence>
  );
}
