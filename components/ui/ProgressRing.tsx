'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useId, useMemo, useState } from 'react';

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({ value, size = 120, strokeWidth = 12, label, className }: ProgressRingProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const safeValue = Math.min(100, Math.max(0, value));
  const gradientId = useId();

  useEffect(() => {
    setDisplayValue(safeValue);
  }, [safeValue]);

  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const strokeDashoffset = useMemo(
    () => circumference - (displayValue / 100) * circumference,
    [circumference, displayValue],
  );

  return (
    <div className={cn('relative inline-flex flex-col items-center justify-center gap-2 text-center', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
        <circle
          stroke="currentColor"
          className="text-[var(--on-surface-1)]/10"
          fill="transparent"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <motion.circle
          stroke={`url(#${gradientId})`}
          fill="transparent"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={{ strokeDasharray: circumference, strokeDashoffset }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-[var(--on-surface-1)]">
        <span className="text-2xl font-serif">{Math.round(displayValue)}%</span>
        {label ? <span className="text-sm font-semibold opacity-70">{label}</span> : null}
      </div>
    </div>
  );
}
