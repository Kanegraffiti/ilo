import { cn } from '@/lib/utils';
import * as React from 'react';

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className }: ChipProps) {
  return (
    <span className={cn('inline-block rounded-full bg-accent/10 text-accent px-3 py-1 text-sm font-medium', className)}>
      {children}
    </span>
  );
}
