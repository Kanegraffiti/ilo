'use client';
import { Button } from './ui/Button';

const keys = ['á', 'à', 'ạ', 'ẹ', 'ọ', 'ṣ', 'gb'];

interface ToneKeypadProps {
  targetId?: string;
}

export default function ToneKeypad({ targetId }: ToneKeypadProps) {
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
    <div className="grid grid-cols-4 gap-2" aria-label="Yorùbá tones keypad">
      {keys.map((c) => (
        <Button
          key={c}
          variant="secondary"
          size="lg"
          onClick={() => insert(c)}
          aria-label={`Insert ${c}`}
        >
          {c}
        </Button>
      ))}
    </div>
  );
}
