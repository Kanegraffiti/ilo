interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      className={`w-full h-4 rounded-2xl bg-ink/10 overflow-hidden ${className ?? ''}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
    </div>
  );
}
