import { motion } from 'framer-motion';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
}

export function ProgressRing({ value, size = 80, stroke = 8 }: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="block">
      <circle
        stroke="var(--color-secondary)"
        fill="transparent"
        strokeWidth={stroke}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        opacity={0.2}
      />
      <motion.circle
        stroke="var(--color-accent)"
        fill="transparent"
        strokeWidth={stroke}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}
