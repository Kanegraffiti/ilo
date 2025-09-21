'use client';

import Icon from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/icons';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const LABELS = {
  light: 'Light',
  dark: 'Dark',
  system: 'Auto',
} as const;

const ICONS: Record<'light' | 'dark' | 'system', IconName> = {
  light: 'star',
  dark: 'shield',
  system: 'globe',
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

  return (
    <motion.button
      type="button"
      aria-label={`Theme: ${LABELS[theme]}. Activate to switch to ${LABELS[nextTheme]}`}
      onClick={() => setTheme(nextTheme)}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-on-surface-2 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
      whileTap={{ scale: 0.96 }}
    >
      <Icon
        name={ICONS[theme]}
        size={18}
        color="var(--on-surface-2)"
        className="inline-flex"
        aria-hidden
      />
      <span>{LABELS[theme]}</span>
    </motion.button>
  );
}
