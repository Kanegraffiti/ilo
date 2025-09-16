'use client';

import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  trailingAccessory?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, errorText, leadingIcon, trailingIcon, trailingAccessory, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = helperText || errorText ? `${inputId}-description` : undefined;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="block text-base font-semibold c-on-surface">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'flex min-h-[56px] items-center gap-3 rounded-2xl border border-[color:var(--color-on-surface)]/10 bg-surface px-4 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-surface)]',
          errorText ? 'border-red-600 focus-within:border-red-600 focus-within:ring-red-500/40' : null,
        )}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className="text-[color:var(--color-on-surface)]/70">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full border-none bg-transparent text-lg c-on-surface placeholder:text-[color:var(--color-on-surface)]/60 focus:outline-none',
            className,
          )}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(errorText)}
          {...props}
        />
        {trailingIcon ? (
          <span aria-hidden="true" className="text-[color:var(--color-on-surface)]/70">
            {trailingIcon}
          </span>
        ) : null}
        {trailingAccessory ? (
          <div className="flex items-center gap-2 text-sm font-semibold c-on-surface">{trailingAccessory}</div>
        ) : null}
      </div>
      {helperText || errorText ? (
        <p
          id={descriptionId}
          className={cn(
            'text-sm',
            errorText
              ? 'text-red-700 dark:text-red-400'
              : 'text-[color:var(--color-on-surface)]/80',
          )}
        >
          {errorText ?? helperText}
        </p>
      ) : null}
    </div>
  );
});
