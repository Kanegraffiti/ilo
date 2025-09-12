'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import ToneKeypad from '@/components/ToneKeypad';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import ConfettiOnce from '@/components/ConfettiOnce';

function PracticeContent() {
  const [tab, setTab] = useState<'pron' | 'quiz'>('pron');
  const { add } = useToast();
  const [confetti, setConfetti] = useState(false);
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Button variant={tab === 'pron' ? 'primary' : 'secondary'} onClick={() => setTab('pron')}>
          Pronunciation
        </Button>
        <Button variant={tab === 'quiz' ? 'primary' : 'secondary'} onClick={() => setTab('quiz')}>
          Quiz
        </Button>
      </div>
      {tab === 'pron' ? (
        <div className="flex flex-col items-center gap-4">
          <Button size="xl" onClick={() => add('🎉 Great job! Saved.')}>🎙️</Button>
          <ToneKeypad />
        </div>
      ) : (
        <div className="space-y-4">
          <p>Question?</p>
          <ToneKeypad />
          <Button
            onClick={() => {
              add('🎉 Great job! Saved.');
              setConfetti(true);
            }}
          >
            Submit
          </Button>
        </div>
      )}
      <ConfettiOnce trigger={confetti} />
    </div>
  );
}

export default function PracticePage() {
  return (
    <ToastProvider>
      <PracticeContent />
    </ToastProvider>
  );
}
