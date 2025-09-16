import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

const chipStyles = cva(
  'inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold tracking-wide text-primary',
  {
    variants: {
      tone: {
        primary: 'bg-primary/15 text-primary',
        secondary: 'bg-secondary/15 text-secondary',
        accent: 'bg-accent/15 text-accent',
        neutral: 'bg-ink/10 text-ink/80',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
      },
      size: {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
      },
    },
    defaultVariants: {
      tone: 'primary',
      size: 'md',
    },
  },
);

export interface ChipProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof chipStyles> {}

export function Chip({ className, tone, size, ...props }: ChipProps) {
  return <span className={cn(chipStyles({ tone, size }), className)} {...props} />;
}
