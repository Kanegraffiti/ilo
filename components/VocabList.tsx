'use client';
import React from 'react';

type Vocab = { id: string; term: string; meaning: string; audio_url?: string };

export default function VocabList({ items }: { items: Vocab[] }) {
  const play = (url?: string, slow = false) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.playbackRate = slow ? 0.8 : 1;
    audio.play();
  };
  return (
    <ul className="space-y-2">
      {items.map((v) => (
        <li key={v.id} className="flex justify-between items-center">
          <div>
            <span className="font-bold">{v.term}</span> – {v.meaning}
          </div>
          <div className="space-x-2">
            <button className="px-2 py-1 bg-primary text-paper" onClick={() => play(v.audio_url)} aria-label="Play normal">
              ▶
            </button>
            <button
              className="px-2 py-1 bg-secondary text-paper"
              onClick={() => play(v.audio_url, true)}
              aria-label="Play slow"
            >
              🐢
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
