import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <label className="block space-y-1">
        <span className="text-lg font-medium">{label}</span>
        <input
          ref={ref}
          className={cn(
            'w-full rounded-2xl border border-ink/20 bg-paper px-4 py-3 text-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
      </label>
    );
  }
);
Input.displayName = 'Input';
