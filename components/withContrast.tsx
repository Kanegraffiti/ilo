import React from 'react';
import type { ContrastBackground } from '@/lib/contrastGuard';
import { defaultTextClassFor } from '@/lib/contrastGuard';

type BG = ContrastBackground;

type AnyProps = React.HTMLAttributes<HTMLElement> & { className?: string };

export function withContrast<T extends AnyProps>(Component: React.ComponentType<T>, bg: BG) {
  return function ContrastSafe(props: T) {
    const base = defaultTextClassFor(bg);
    const className = [base, props.className].filter(Boolean).join(' ');
    return <Component {...(props as T)} className={className} />;
  };
}
