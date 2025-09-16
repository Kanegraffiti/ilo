'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface VocabItem {
  id: string;
  term: string;
  translation: string;
  audioUrl?: string;
}

export interface VocabListProps {
  items: VocabItem[];
  className?: string;
}

export function VocabList({ items, className }: VocabListProps) {
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handlePlay = async (item: VocabItem) => {
    audioRef.current?.pause();

    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;
      try {
        await audio.play();
      } catch (error) {
        // fallback to speech synthesis if playback fails
        speakTerm(item.term);
      }
      return;
    }

    speakTerm(item.term);
  };

  const speakTerm = (term: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.lang = 'yo-NG';
    utterance.rate = playbackRate;
    window.speechSynthesis.speak(utterance);
  };

  const togglePlayback = () => {
    setPlaybackRate((prev) => (prev === 1 ? 0.85 : 1));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif">Tap to hear the words</h3>
        <Button variant="secondary" size="md" onClick={togglePlayback}>
          {playbackRate === 1 ? 'Normal 1×' : 'Slow 0.85×'}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card
            key={item.id}
            className="border border-ink/10 bg-white/80"
            bodyClassName="flex items-center justify-between gap-4"
          >
            <div className="space-y-1 text-left">
              <p className="text-2xl font-serif text-ink">{item.term}</p>
              <p className="text-lg text-ink/70">{item.translation}</p>
              <Chip tone="accent" size="sm">
                Tap to hear
              </Chip>
            </div>
            <Button
              variant="ghost"
              size="md"
              onClick={() => handlePlay(item)}
              aria-label={`Play pronunciation for ${item.term}`}
              leadingIcon={<Volume2 className="h-6 w-6" />}
            >
              Hear it
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
