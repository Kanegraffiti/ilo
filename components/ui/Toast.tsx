'use client';

import Icon from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/icons';
import { usePageEnter } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastTone = 'info' | 'success' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  action?: ReactNode;
}

interface ToastMessage extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  push: (toast: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toneStyles: Record<ToastTone, string> = {
  info: 'border-primary/20 bg-paper',
  success: 'border-emerald-400/60 bg-emerald-50 text-emerald-900',
  error: 'border-red-400/60 bg-red-50 text-red-900',
};

const toneIcon: Record<ToastTone, IconName> = {
  info: 'star',
  success: 'party',
  error: 'shield',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    ({ title, description, tone = 'info', duration = 5000, action }: ToastOptions) => {
      const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString();
      setToasts((prev) => [...prev, { id, title, description, tone, duration, action }]);

      if (duration > 0 && typeof window !== 'undefined') {
        window.setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, push, dismiss }),
    [toasts, push, dismiss],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast();
  const toastMotion = usePageEnter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-3 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            {...toastMotion}
            role="status"
            aria-live="polite"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm flex-col gap-2 rounded-2xl border px-4 py-3 text-ink shadow-md focus-within:outline-none focus-within:ring-4 focus-within:ring-accent/30',
              toneStyles[toast.tone ?? 'info'],
            )}
          >
            <div className="flex items-start gap-3">
              <Icon
                name={toneIcon[toast.tone ?? 'info']}
                size={24}
                color="currentColor"
                className="text-2xl"
                aria-hidden
              />
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-lg">{toast.title}</p>
                {toast.description ? <p className="text-base text-ink/70">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                className="ml-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:underline"
                onClick={() => dismiss(toast.id)}
              >
                Close
              </button>
            </div>
            {toast.action ? <div className="pt-1">{toast.action}</div> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
