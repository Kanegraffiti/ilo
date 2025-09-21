'use client';

import { useCardPop, usePageEnter, usePrefersReducedMotion } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function Modal({ title, description, isOpen, onClose, children, actions, className }: ModalProps) {
  const backdropMotion = usePageEnter();
  const cardMotion = useCardPop();
  const reduced = usePrefersReducedMotion();
  const initialFocusRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const instanceId = useId();
  const titleId = `modal-title-${instanceId}`;
  const descriptionId = description ? `modal-description-${instanceId}` : undefined;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      queueMicrotask(() => initialFocusRef.current?.focus());
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      const previouslyFocused = previousActiveElement.current as HTMLElement | null;
      previouslyFocused?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const content = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          {...(!reduced ? backdropMotion : {})}
          role="presentation"
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--on-paper)]/40"
            onClick={onClose}
            tabIndex={-1}
          />
          <motion.div
            {...(!reduced ? cardMotion : {})}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className={cn(
              'relative w-full max-w-xl rounded-2xl bg-surface-1 c-on-surface-1 p-6 shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/40',
              className,
            )}
          >
            <div tabIndex={-1} ref={initialFocusRef} className="sr-only">
              Modal focus sentinel
            </div>
            <header className="space-y-2 pb-4">
              <h2 id={titleId} className="text-2xl font-serif">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="text-base opacity-80">
                  {description}
                </p>
              ) : null}
            </header>
            <div className="space-y-4 text-lg">{children}</div>
            {actions ? <footer className="mt-6 flex flex-wrap gap-3">{actions}</footer> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(content, document.body);
}
