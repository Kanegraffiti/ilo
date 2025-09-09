import React from 'react';

export default function StreakCounter({ days }: { days: number }) {
  return <div aria-label="Streak">🔥 {days} day streak</div>;
}
