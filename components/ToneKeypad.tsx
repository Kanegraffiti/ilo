'use client';
import React from 'react';

const chars = ['á', 'à', 'ạ', 'ẹ', 'ọ', 'ṣ', 'gb'];

export default function ToneKeypad({ targetId }: { targetId?: string }) {
  const insert = (ch: string) => {
    let el: HTMLInputElement | HTMLTextAreaElement | null = null;
    if (targetId) {
      const t = document.getElementById(targetId);
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) el = t;
    } else {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) el = active;
    }
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const val = el.value;
    el.value = val.slice(0, start) + ch + val.slice(end);
    el.selectionStart = el.selectionEnd = start + ch.length;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
  };
  return (
    <div className="flex flex-wrap gap-2 p-2" aria-label="Yoruba tones keypad">
      {chars.map((c) => (
        <button
          key={c}
          aria-label={`Insert ${c}`}
          className="w-11 h-11 flex items-center justify-center rounded bg-accent text-paper"
          onClick={() => insert(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
