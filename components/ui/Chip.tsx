import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

const chipStyles = cva(
  'inline-flex items-center gap-2 rounded-full r-xl px-3 py-1 text-sm font-semibold tracking-wide transition-colors',
  {
    variants: {
      tone: {
        accent: 'bg-accent c-on-accent shadow-sm',
        secondary: 'bg-surface-2 c-on-surface-2 b-border',
        warning: 'bg-surface-3 c-on-surface-3 b-border',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      tone: 'accent',
      size: 'md',
    },
  },
);

export interface ChipProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof chipStyles> {}

export function Chip({ className, tone, size, ...props }: ChipProps) {
  return <span className={cn(chipStyles({ tone, size }), className)} {...props} />;
}
