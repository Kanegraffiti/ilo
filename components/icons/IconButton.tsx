'use client';

import Icon from './Icon';

export default function IconButton({
  name,
  onClick,
  label,
}: {
  name: import('./icons').IconName;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-surface-2 text-[var(--on-surface-2)] shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)]"
    >
      <Icon name={name} size={20} />
    </button>
  );
}
