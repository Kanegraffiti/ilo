'use client';

import { usePressable } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface TabNavItem {
  href: string;
  label: string;
  badge?: number | null;
}

export interface TabNavProps {
  items: TabNavItem[];
  className?: string;
}

export function TabNav({ items, className }: TabNavProps) {
  const pathname = usePathname();
  const pressable = usePressable();

  return (
    <nav
      aria-label="Teacher tabs"
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-2xl border border-ink/10 bg-surface-100/80 p-2 text-sm shadow-sm backdrop-blur',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <motion.div key={item.href} {...pressable} className="min-w-[120px] flex-1">
            <Link
              href={item.href}
              className={cn(
                'group flex h-12 items-center justify-center gap-2 rounded-2xl px-4 font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40',
                isActive
                  ? 'bg-primary text-on-primary shadow-[0_8px_16px_rgba(0,0,0,0.12)]'
                  : 'bg-transparent text-ink/80 hover:bg-surface-200 hover:text-ink',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-on-accent">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
