import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card(
  { className, ...props }: React.HTMLAttributes<HTMLDivElement>
) {
  return <div className={cn('rounded-2xl bg-paper p-4 shadow-sm', className)} {...props} />;
}
