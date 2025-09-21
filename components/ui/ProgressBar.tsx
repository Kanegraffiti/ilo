import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('space-y-2', className)}>
      {label ? <p className="text-sm font-semibold uppercase opacity-70">{label}</p> : null}
      <div className="h-4 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${safeValue}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeValue}
        />
      </div>
      <span className="block text-right text-sm font-semibold opacity-80">{safeValue}%</span>
    </div>
  );
}
