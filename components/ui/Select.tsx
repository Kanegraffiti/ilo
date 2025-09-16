'use client';

import { cn } from '@/lib/utils';
import type { SelectHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helperText, errorText, className, id, children, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = helperText || errorText ? `${selectId}-description` : undefined;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="block text-base font-semibold text-ink">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'relative flex min-h-[56px] items-center rounded-2xl border border-ink/10 bg-white/90 px-4 text-lg shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/30',
          errorText ? 'border-red-500 focus-within:ring-red-200' : null,
        )}
      >
        <select
          ref={ref}
          id={selectId}
          className={cn('w-full appearance-none bg-transparent pr-8 text-lg text-ink focus:outline-none', className)}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(errorText)}
          {...props}
        >
          {children}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-4 text-ink/50">
          ▾
        </span>
      </div>
      {helperText || errorText ? (
        <p id={descriptionId} className={cn('text-sm', errorText ? 'text-red-600' : 'text-ink/60')}>
          {errorText ?? helperText}
        </p>
      ) : null}
    </div>
  );
});
