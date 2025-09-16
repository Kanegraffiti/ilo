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
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, errorText, leadingIcon, trailingIcon, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = helperText || errorText ? `${inputId}-description` : undefined;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="block text-base font-semibold text-ink">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'flex min-h-[56px] items-center gap-3 rounded-2xl border border-ink/10 bg-white/90 px-4 shadow-sm ring-offset-2 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/30',
          errorText ? 'border-red-500 focus-within:ring-red-200' : null,
        )}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className="text-ink/60">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn('h-14 w-full border-none bg-transparent text-lg text-ink placeholder:text-ink/40 focus:outline-none', className)}
          aria-describedby={descriptionId}
          aria-invalid={Boolean(errorText)}
          {...props}
        />
        {trailingIcon ? (
          <span aria-hidden="true" className="text-ink/60">
            {trailingIcon}
          </span>
        ) : null}
      </div>
      {helperText || errorText ? (
        <p
          id={descriptionId}
          className={cn('text-sm', errorText ? 'text-red-600' : 'text-ink/60')}
        >
          {errorText ?? helperText}
        </p>
      ) : null}
    </div>
  );
});
