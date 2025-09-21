import Icon from '@/components/icons/Icon';
import React from 'react';

export default function StreakCounter({ days }: { days: number }) {
  return (
    <div aria-label="Streak" className="inline-flex items-center gap-1">
      <Icon name="star" size={16} aria-hidden />
      {days} day streak
    </div>
  );
}
