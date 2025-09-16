'use client';

import { usePressable } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface AvatarOption {
  id: string;
  label: string;
  render: ReactNode;
}

const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'sunny-tortoise',
    label: 'Sunny tortoise',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="Sunny tortoise avatar">
        <circle cx="60" cy="60" r="56" fill="#F4E7CD" />
        <circle cx="60" cy="54" r="32" fill="#9C5C2E" />
        <circle cx="46" cy="48" r="6" fill="#F4E7CD" />
        <circle cx="74" cy="48" r="6" fill="#F4E7CD" />
        <path d="M44 70 Q60 82 76 70" stroke="#F4E7CD" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: 'forest-friend',
    label: 'Forest friend',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="Forest friend avatar">
        <rect width="120" height="120" rx="48" fill="#4A5B3F" />
        <circle cx="45" cy="50" r="10" fill="#F3EBDD" />
        <circle cx="75" cy="50" r="10" fill="#F3EBDD" />
        <path d="M40 78 Q60 94 80 78" stroke="#F3EBDD" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: 'laughing-star',
    label: 'Laughing star',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="Laughing star avatar">
        <rect width="120" height="120" rx="32" fill="#D37E2C" />
        <polygon points="60,12 74,48 112,48 80,72 92,108 60,86 28,108 40,72 8,48 46,48" fill="#FCEFD6" />
      </svg>
    ),
  },
  {
    id: 'gentle-moon',
    label: 'Gentle moon',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="Gentle moon avatar">
        <circle cx="60" cy="60" r="58" fill="#2C221B" />
        <path d="M70 20a38 38 0 1 0 0 80 38 38 0 0 1 0-80z" fill="#F4E7CD" />
        <circle cx="48" cy="54" r="6" fill="#2C221B" />
        <circle cx="62" cy="64" r="4" fill="#2C221B" />
      </svg>
    ),
  },
  {
    id: 'joyful-drum',
    label: 'Joyful drum',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="Joyful drum avatar">
        <rect width="120" height="120" rx="40" fill="#F4E7CD" />
        <ellipse cx="60" cy="36" rx="36" ry="24" fill="#9C5C2E" />
        <rect x="30" y="36" width="60" height="54" rx="12" fill="#D37E2C" />
        <path d="M30 60 L90 60" stroke="#9C5C2E" strokeWidth="6" />
      </svg>
    ),
  },
  {
    id: 'dancing-mask',
    label: 'Dancing mask',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="Dancing mask avatar">
        <rect width="120" height="120" rx="44" fill="#4A5B3F" />
        <path d="M60 20 C30 20 24 48 28 72 C32 98 48 108 60 108 C72 108 88 98 92 72 C96 48 90 20 60 20Z" fill="#F3EBDD" />
        <circle cx="48" cy="60" r="8" fill="#4A5B3F" />
        <circle cx="72" cy="60" r="8" fill="#4A5B3F" />
        <path d="M44 78 Q60 88 76 78" stroke="#4A5B3F" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'spark-kite',
    label: 'Spark kite',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="Spark kite avatar">
        <rect width="120" height="120" rx="32" fill="#D37E2C" />
        <polygon points="60,16 100,60 60,104 20,60" fill="#F4E7CD" />
        <path d="M60 104 L60 120" stroke="#F4E7CD" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'river-wave',
    label: 'River wave',
    render: (
      <svg viewBox="0 0 120 120" className="h-20 w-20" role="img" aria-label="River wave avatar">
        <rect width="120" height="120" rx="50" fill="#2C221B" />
        <path d="M10 80 Q30 60 50 80 T90 80 T130 80" stroke="#F3EBDD" strokeWidth="10" fill="none" />
        <path d="M10 96 Q30 76 50 96 T90 96 T130 96" stroke="#F3EBDD" strokeWidth="8" fill="none" opacity="0.6" />
      </svg>
    ),
  },
];

export interface AvatarPickerProps {
  selectedId?: string;
  onSelect: (avatarId: string) => void;
  options?: AvatarOption[];
  className?: string;
}

export function AvatarPicker({ selectedId, onSelect, options = AVATAR_OPTIONS, className }: AvatarPickerProps) {
  const pressable = usePressable();

  return (
    <div
      className={cn('grid gap-4 sm:grid-cols-4', className)}
      role="radiogroup"
      aria-label="Choose an avatar"
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <motion.button
            key={option.id}
            type="button"
            {...pressable}
            onClick={() => onSelect(option.id)}
            className={cn(
              'flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-transparent bg-white/90 p-4 text-center shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40',
              isSelected ? 'border-primary shadow-md' : 'hover:border-primary/60',
            )}
            role="radio"
            aria-checked={isSelected}
            aria-label={option.label}
          >
            <div aria-hidden="true">{option.render}</div>
            <span className="text-base font-semibold text-ink/80">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
