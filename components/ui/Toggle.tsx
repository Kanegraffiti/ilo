'use client';

import { usePressable } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  helperText?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { checked, onCheckedChange, label, helperText, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;
  const pressable = usePressable();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span id={`${toggleId}-label`} className="text-base font-semibold text-ink">
          {label}
        </span>
        <motion.div {...pressable}>
          <button
            ref={ref}
            type="button"
            role="switch"
            aria-checked={checked}
            aria-labelledby={`${toggleId}-label`}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
              'relative inline-flex h-11 w-20 items-center rounded-full border border-transparent px-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(211,126,44,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
              checked ? 'bg-primary/90' : 'bg-ink/15',
              className,
            )}
            {...props}
          >
            <span className="sr-only">Toggle {label}</span>
            <span
              aria-hidden="true"
              className={cn(
                'block h-9 w-9 rounded-full bg-paper shadow-md transition-transform',
                checked ? 'translate-x-9' : 'translate-x-0',
              )}
            />
          </button>
        </motion.div>
      </div>
      {helperText ? <p className="text-sm text-ink/60">{helperText}</p> : null}
    </div>
  );
});
