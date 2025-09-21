'use client';

import { usePressable } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BookOpen, Home, Medal, Mic, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface BottomNavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const DEFAULT_ITEMS: BottomNavItem[] = [
  { label: 'Home', href: '/home', icon: <Home className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Practice', href: '/practice/intro', icon: <Mic className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Lessons', href: '/lessons', icon: <BookOpen className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Leaderboard', href: '/leaderboards', icon: <Medal className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Profile', href: '/profile', icon: <UserCircle className="h-6 w-6" aria-hidden="true" /> },
];

export interface BottomNavProps {
  items?: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items = DEFAULT_ITEMS, className }: BottomNavProps) {
  const pathname = usePathname();
  const pressable = usePressable();

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-surface-1 c-on-surface-1 backdrop-blur-md shadow-[0_-6px_16px_rgba(0,0,0,0.08)] supports-[backdrop-filter]:bg-surface-1/90 md:hidden',
        className,
      )}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <motion.div {...pressable}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-16 flex-col items-center justify-center gap-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/40',
                    isActive ? 'text-[var(--color-primary)]' : 'opacity-80 hover:text-[var(--color-primary)]',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex items-center justify-center" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
