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
        <label htmlFor={inputId} className="block text-base font-semibold text-[var(--on-paper)]">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'flex min-h-[56px] items-center gap-3 rounded-2xl r-xl b-border bg-surface-1 c-on-surface-1 px-4 shadow-sm transition focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--paper)]',
          errorText ? 'border-[1px] border-[#d24b4b] focus-within:ring-[#d24b4b]' : null,
        )}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className="text-[var(--on-surface-1)]/70">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full border-none bg-transparent text-lg text-[var(--on-surface-1)] placeholder:text-[var(--on-surface-1)]/60 focus:outline-none',
            className,
          )}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(errorText)}
          {...props}
        />
        {trailingIcon ? (
          <span aria-hidden="true" className="text-[var(--on-surface-1)]/70">
            {trailingIcon}
          </span>
        ) : null}
        {trailingAccessory ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--on-surface-1)]">{trailingAccessory}</div>
        ) : null}
      </div>
      {helperText || errorText ? (
        <p
          id={descriptionId}
          className={cn(
            'text-sm',
            errorText
              ? 'text-[#d24b4b]'
              : 'text-[var(--on-surface-1)]/75',
          )}
        >
          {errorText ?? helperText}
        </p>
      ) : null}
    </div>
  );
});
