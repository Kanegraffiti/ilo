'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const avatars = ['🐢','🦊','🐼','🐵'];

export default function AvatarPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [selected, setSelected] = useState<string>('');
  return (
    <div className="flex gap-2" aria-label="Avatar choices">
      {avatars.map((a) => (
        <motion.button
          key={a}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelected(a);
            onSelect(a);
          }}
          aria-pressed={selected === a}
          className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center bg-paper border ${selected===a?'border-accent':'border-transparent'}`}
        >
          {a}
        </motion.button>
      ))}
    </div>
  );
}
