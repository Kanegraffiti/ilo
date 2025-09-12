'use client';
import { useState } from 'react';
import { Button } from './ui/Button';

const avatars = ['🐢', '🦊', '🐼', '🐵', '🐰', '🐸'];

interface AvatarPickerProps {
  onSelect?: (emoji: string) => void;
}

export default function AvatarPicker({ onSelect }: AvatarPickerProps) {
  const [selected, setSelected] = useState('');
  return (
    <div className="grid grid-cols-3 gap-4" aria-label="Avatar choices">
      {avatars.map((a) => (
        <Button
          key={a}
          variant={selected === a ? 'primary' : 'secondary'}
          size="lg"
          aria-pressed={selected === a}
          aria-label={`Choose avatar ${a}`}
          onClick={() => {
            setSelected(a);
            onSelect?.(a);
          }}
        >
          {a}
        </Button>
      ))}
    </div>
  );
}
