'use client';
import { useEffect, useState } from 'react';
import proverbs from '@/content/proverbs.json';

export default function ProverbRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % proverbs.length), 6000);
    return () => clearInterval(id);
  }, []);
  const p = proverbs[index];
  return (
    <div className="bg-accent text-ink py-4 text-center">
      <p className="font-display">{p.text}</p>
      <p className="text-sm">{p.meaning}</p>
    </div>
  );
}
