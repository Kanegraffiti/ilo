'use client';
import { motion } from 'framer-motion';
import { usePressable } from '@/lib/anim';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  const press = usePressable();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('flex items-center gap-2 min-h-[44px]', className)}
      {...press}
    >
      <span className="sr-only">{label}</span>
      <motion.span
        className={cn(
          'w-10 h-6 rounded-full p-1',
          checked ? 'bg-primary' : 'bg-ink/20'
        )}
      >
        <motion.span
          className="block h-4 w-4 rounded-full bg-paper"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </motion.span>
      <span className="text-lg text-ink">{label}</span>
    </button>
  );
}
