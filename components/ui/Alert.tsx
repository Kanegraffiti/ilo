import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type AlertVariant = 'success' | 'error';

const variantConfig: Record<AlertVariant, { border: string; icon: ReactNode; iconClass: string; titleDefault: string }> = {
  success: {
    border: 'border-l-4 border-emerald-500',
    icon: <CheckCircle2 className="h-6 w-6" aria-hidden="true" />,
    iconClass: 'text-emerald-700 dark:text-emerald-300',
    titleDefault: 'Success',
  },
  error: {
    border: 'border-l-4 border-red-600',
    icon: <AlertTriangle className="h-6 w-6" aria-hidden="true" />,
    iconClass: 'text-red-700 dark:text-red-400',
    titleDefault: 'Please try again',
  },
};

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function Alert({ variant, title, children, className, actions }: AlertProps) {
  const config = variantConfig[variant];
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={cn(
        'flex w-full items-start gap-4 rounded-2xl bg-surface px-4 py-3 shadow-sm c-on-surface',
        config.border,
        className,
      )}
    >
      <span className={cn('mt-0.5 shrink-0', config.iconClass)}>{config.icon}</span>
      <div className="flex-1 space-y-1">
        <p className="font-semibold leading-tight">
          {title ?? config.titleDefault}
        </p>
        <div className="text-base leading-relaxed">{children}</div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
