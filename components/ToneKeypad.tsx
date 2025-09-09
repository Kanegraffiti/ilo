'use client';
import React from 'react';

const chars = ['á', 'à', 'ạ', 'ẹ', 'ọ', 'ṣ', 'gb'];

export default function ToneKeypad() {
  const insert = (ch: string) => {
    const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    if (!el || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const val = el.value;
    el.value = val.slice(0, start) + ch + val.slice(end);
    el.selectionStart = el.selectionEnd = start + ch.length;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  return (
    <div className="flex flex-wrap gap-2 p-2" aria-label="Yoruba tones keypad">
      {chars.map((c) => (
        <button key={c} className="px-2 py-1 rounded bg-accent text-paper" onClick={() => insert(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
