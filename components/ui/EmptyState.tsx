import * as React from 'react';
import { motion } from 'framer-motion';
import { useCardPop } from '@/lib/anim';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  cta?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, subtitle, cta }: EmptyStateProps) {
  const card = useCardPop();
  return (
    <motion.div
      {...card}
      className="text-center flex flex-col items-center gap-4 p-4"
    >
      <div className="text-4xl" aria-hidden>{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-ink/80">{subtitle}</p>}
      {cta && <Button onClick={cta.onClick}>{cta.label}</Button>}
    </motion.div>
  );
}
