import React from 'react';

type Badge = { id: string; title: string };

export default function BadgeRow({ badges }: { badges: Badge[] }) {
  return (
    <div className="flex gap-2" aria-label="Badges">
      {badges.map((b) => (
        <span key={b.id} className="px-2 py-1 bg-accent text-paper rounded">
          {b.title}
        </span>
      ))}
    </div>
  );
}
