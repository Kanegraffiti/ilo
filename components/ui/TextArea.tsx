'use client';

import { cn } from '@/lib/utils';
import type { TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

export function TextArea({ className, minRows = 4, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      rows={minRows}
      className={cn(
        'min-h-[140px] w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-base text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/30',
        className,
      )}
    />
  );
}
