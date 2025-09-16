'use client';

import { usePrefersReducedMotion } from '@/lib/anim';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
}

const COLORS = ['#D37E2C', '#9C5C2E', '#4A5B3F', '#F4E7CD', '#F9B256'];

export interface ConfettiOnceProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiOnce({ trigger, onComplete }: ConfettiOnceProps) {
  const reduced = usePrefersReducedMotion();
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (!trigger || fired) {
      return;
    }

    if (reduced) {
      setFired(true);
      onComplete?.();
      return;
    }

    const generatedPieces: ConfettiPiece[] = Array.from({ length: 18 }).map((_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.6 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      color: COLORS[index % COLORS.length],
    }));

    setPieces(generatedPieces);
    setFired(true);

    const timer = window.setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [trigger, fired, reduced, onComplete]);

  if (reduced) {
    return null;
  }

  return (
    <AnimatePresence>
      {pieces.length > 0 ? (
        <motion.div
          key="confetti"
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex h-0 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative h-[200px] w-full max-w-4xl">
            {pieces.map((piece) => (
              <motion.span
                key={piece.id}
                aria-hidden="true"
                className="absolute block h-3 w-8 rounded-full"
                style={{ left: `${piece.left}%`, backgroundColor: piece.color }}
                initial={{ y: -40, opacity: 0, rotate: 0 }}
                animate={{ y: 200, opacity: 1, rotate: piece.rotation }}
                transition={{ delay: piece.delay, duration: piece.duration, ease: 'easeOut' }}
              />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
