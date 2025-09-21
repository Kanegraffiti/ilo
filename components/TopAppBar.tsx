'use client';

import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { cn } from '@/lib/utils';
import { Bell, Menu, UserCircle } from 'lucide-react';
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
        'sticky top-0 z-40 border-b border-[var(--border)] bg-surface-1 c-on-surface-1 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-surface-1/90',
        className,
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-screen-lg items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <BrandLogo size={44} className="rounded-full bg-surface-2 c-on-surface-2 p-2" title="Ìlọ̀ dashboard" />
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-surface-2 c-on-surface-2 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/40 md:hidden"
            onClick={onMenuToggle}
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          {children}
          {typeof streakDays === 'number' ? (
            <Chip tone="accent" size="sm">
              🔥 {streakDays} day streak
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
