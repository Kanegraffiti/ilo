'use client';

import { cn } from '@/lib/utils';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helperText, errorText, className, id, children, leadingIcon, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = helperText || errorText ? `${selectId}-description` : undefined;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="block text-base font-semibold c-on-surface">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'relative flex min-h-[56px] items-center gap-3 rounded-2xl border border-[color:var(--color-on-surface)]/10 bg-surface px-4 text-lg shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-surface)]',
          errorText ? 'border-red-600 focus-within:border-red-600 focus-within:ring-red-500/40' : null,
        )}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className="text-[color:var(--color-on-surface)]/70">
            {leadingIcon}
          </span>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full flex-1 appearance-none bg-transparent pr-8 text-lg c-on-surface focus:outline-none',
            className,
          )}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(errorText)}
          {...props}
        >
          {children}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-4 text-[color:var(--color-on-surface)]/70">
          ▾
        </span>
      </div>
      {helperText || errorText ? (
        <p
          id={descriptionId}
          className={cn(
            'text-sm',
            errorText ? 'text-red-700 dark:text-red-400' : 'text-[color:var(--color-on-surface)]/80',
          )}
        >
          {errorText ?? helperText}
        </p>
      ) : null}
    </div>
  );
});
