'use client';
import React, { useState } from 'react';
import { CardState, initCard, review } from '../lib/srs';

type Card = { id: string; front: string; back: string; state: CardState };

export default function Flashcards({ items }: { items: { id: string; term: string; meaning: string }[] }) {
  const [cards, setCards] = useState<Card[]>(
    items.map((i) => ({ id: i.id, front: i.term, back: i.meaning, state: initCard() }))
  );
  const [showBack, setShowBack] = useState(false);
  const [index, setIndex] = useState(0);
  const current = cards[index];

  const grade = (q: 0 | 1 | 2 | 3 | 4 | 5) => {
    const updated = { ...current, state: review(current.state, q) };
    const newCards = [...cards];
    newCards[index] = updated;
    setCards(newCards);
    setShowBack(false);
    setIndex((index + 1) % cards.length);
  };

  if (!current) return null;
  return (
    <div className="space-y-2">
      <div className="p-4 border rounded bg-paper" onClick={() => setShowBack(!showBack)}>
        {showBack ? current.back : current.front}
      </div>
      {showBack && (
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((q) => (
            <button key={q} onClick={() => grade(q as any)} className="px-2 py-1 bg-accent text-paper">
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
