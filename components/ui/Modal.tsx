'use client';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePageEnter, useCardPop } from '@/lib/anim';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  const backdrop = usePageEnter();
  const card = useCardPop();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
          {...backdrop}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className={cn('bg-paper text-ink rounded-2xl p-4 w-full max-w-md', className)}
            {...card}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
