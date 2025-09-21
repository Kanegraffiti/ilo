'use client';

import Icon from '@/components/icons/Icon';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { cn } from '@/lib/utils';
import { Bell, Menu, UserCircle } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface TopAppBarProps {
  className?: string;
  onMenuToggle?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  streakDays?: number;
  children?: ReactNode;
}

export function TopAppBar({
  className,
  onMenuToggle,
  onNotificationsClick,
  onProfileClick,
  streakDays,
  children,
}: TopAppBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur-md shadow-sm',
        className,
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-screen-lg items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-white text-ink shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 md:hidden"
            onClick={onMenuToggle}
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <Link href="/home" className="flex items-center gap-3 text-2xl font-serif text-ink">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-[var(--color-primary)]" aria-hidden="true">
              <Icon name="tortoise" size={28} />
            </span>
            <span className="leading-none">
              Ìlọ̀
              <span className="block text-sm font-sans text-ink/60">Let’s learn!</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {children}
          {typeof streakDays === 'number' ? (
            <Chip tone="accent" size="sm">
              <Icon name="star" size={14} color="var(--on-accent)" className="shrink-0" />
              {streakDays} day streak
            </Chip>
          ) : null}
          <Button
            variant="ghost"
            size="md"
            leadingIcon={<Bell className="h-6 w-6" aria-hidden="true" />}
            onClick={onNotificationsClick}
            aria-label="Notifications"
          >
            Alerts
          </Button>
          <Button
            variant="secondary"
            size="md"
            leadingIcon={<UserCircle className="h-6 w-6" aria-hidden="true" />}
            onClick={onProfileClick}
          >
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
}
