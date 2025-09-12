import * as React from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, ...props }, ref) => (
    <label className="block space-y-1">
      <span className="text-lg font-medium">{label}</span>
      <select
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-ink/20 bg-paper px-4 py-3 text-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  )
);
Select.displayName = 'Select';
