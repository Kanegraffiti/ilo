import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DividerProps {
  children?: ReactNode;
  className?: string;
}

export function Divider({ children, className }: DividerProps) {
  return (
    <div className={cn('my-6 flex items-center gap-3', className)} role="separator" aria-orientation="horizontal">
      <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--color-on-surface)]/30" />
      {children ? (
        <span className="text-xs font-semibold uppercase tracking-wider c-on-surface">{children}</span>
      ) : null}
      <span aria-hidden="true" className="h-px flex-1 bg-[color:var(--color-on-surface)]/30" />
    </div>
  );
}
