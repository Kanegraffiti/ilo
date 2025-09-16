'use client';

import { usePressable } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';
import { useCallback } from 'react';

const TONE_KEYS = [
  { label: 'á', value: 'á' },
  { label: 'à', value: 'à' },
  { label: 'ạ', value: 'ạ' },
  { label: 'é', value: 'é' },
  { label: 'è', value: 'è' },
  { label: 'ẹ', value: 'ẹ' },
  { label: 'í', value: 'í' },
  { label: 'ì', value: 'ì' },
  { label: 'ọ', value: 'ọ' },
  { label: 'ú', value: 'ú' },
  { label: 'ù', value: 'ù' },
  { label: 'ṣ', value: 'ṣ' },
  { label: 'ń', value: 'ń' },
  { label: 'gb', value: 'gb' },
];

function insertAtCaret(target: HTMLInputElement | HTMLTextAreaElement, text: string) {
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  const value = target.value;
  const newValue = `${value.slice(0, start)}${text}${value.slice(end)}`;
  const caretPosition = start + text.length;
  target.value = newValue;
  target.setSelectionRange(caretPosition, caretPosition);
  target.dispatchEvent(new Event('input', { bubbles: true }));
}

export interface ToneKeypadProps {
  targetId?: string;
  onInsert?: (value: string) => void;
  className?: string;
  toneKeys?: typeof TONE_KEYS;
}

export function ToneKeypad({ targetId, onInsert, className, toneKeys = TONE_KEYS }: ToneKeypadProps) {
  const pressable = usePressable();

  const handleInsert = useCallback(
    (value: string) => {
      if (targetId && typeof document !== 'undefined') {
        const element = document.getElementById(targetId) as HTMLInputElement | HTMLTextAreaElement | null;
        if (element) {
          insertAtCaret(element, value);
          element.focus();
        }
      }
      onInsert?.(value);
    },
    [onInsert, targetId],
  );

  return (
    <div className={cn('flex flex-wrap gap-3 rounded-2xl bg-secondary/5 p-3', className)} aria-label="Yorùbá tone keypad">
      {toneKeys.map((key) => (
        <motion.button
          key={key.label}
          type="button"
          {...pressable}
          onClick={() => handleInsert(key.value)}
          className="min-h-[56px] min-w-[56px] rounded-2xl bg-white px-4 py-3 text-lg font-bold text-ink shadow-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(211,126,44,0.4)]"
        >
          {key.label}
        </motion.button>
      ))}
    </div>
  );
}
