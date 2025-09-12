'use client';
import { motion } from 'framer-motion';

export default function ProgressRing({ value }: { value: number }) {
  const radius = 30;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={80} height={80} className="rotate-[-90deg]">
      <circle cx={40} cy={40} r={radius} stroke="var(--color-secondary)" strokeWidth={8} fill="transparent" />
      <motion.circle
        cx={40}
        cy={40}
        r={radius}
        stroke="var(--color-accent)"
        strokeWidth={8}
        fill="transparent"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        animate={{ strokeDashoffset: offset }}
      />
    </svg>
  );
}
