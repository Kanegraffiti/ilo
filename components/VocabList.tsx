'use client';
import React, { useEffect, useState } from 'react';
import { getSignedUrl } from '@/lib/storage';

type Vocab = { id: string; term: string; meaning: string; audio_path?: string };

export default function VocabList({ items }: { items: Vocab[] }) {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    items.forEach(async (v) => {
      if (v.audio_path) {
        const url = await getSignedUrl(v.audio_path);
        setUrls((u) => ({ ...u, [v.id]: url }));
      }
    });
  }, [items]);

  const play = (id: string, slow = false) => {
    const url = urls[id];
    if (!url) return;
    const audio = new Audio(url);
    audio.playbackRate = slow ? 0.85 : 1;
    audio.play();
  };
  return (
    <ul className="space-y-2">
      {items.map((v) => (
        <li key={v.id} className="flex justify-between items-center">
          <div>
            <span className="font-bold">{v.term}</span> – {v.meaning}
          </div>
          {v.audio_path && (
            <div className="space-x-2">
              <button
                className="px-2 py-1 bg-primary text-paper"
                onClick={() => play(v.id)}
                aria-label={`Play ${v.term}`}
              >
                ▶
              </button>
              <button
                className="px-2 py-1 bg-secondary text-paper"
                onClick={() => play(v.id, true)}
                aria-label={`Play ${v.term} slowly`}
              >
                🐢
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
