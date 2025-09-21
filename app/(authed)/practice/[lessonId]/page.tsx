'use client';

import Icon from '@/components/icons/Icon';
import { AudioRecorder } from '@/components/AudioRecorder';
import { QuizBlock, type QuizItem } from '@/components/QuizBlock';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { useToast } from '@/components/ui/Toast';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const QUIZ_BANK: QuizItem[] = [
  {
    id: 'greet-choice',
    type: 'mcq',
    prompt: 'Which phrase means “Good evening” in Yorùbá?',
    choices: [
      { id: 'morning', label: 'Ẹ káàárọ̀' },
      { id: 'evening', label: 'Ẹ káalẹ́' },
      { id: 'happy', label: 'Inú mi dùn' },
    ],
    answer: 'evening',
    hint: 'Think of the sun going down.',
  },
  {
    id: 'tone-text',
    type: 'text',
    prompt: 'Write “How are you?” in Yorùbá with tone marks.',
    answer: 'Báwo ni o ṣe ń rí?',
    hint: 'Use ToneKeypad for “ń”.',
  },
];

export default function PracticePage({ params }: { params: { lessonId: string } }) {
  const [tab, setTab] = useState<'pronunciation' | 'quiz'>('pronunciation');
  const { push } = useToast();
  const pageMotion = usePageEnter();
  const lessonTitle = useMemo(() => decodeURIComponent(params.lessonId).replace(/[-_]/g, ' '), [params.lessonId]);

  const handleRecordingSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
  };

  return (
    <motion.div {...pageMotion} className="space-y-8">
      <header className="space-y-3">
        <Chip tone="accent" size="sm">
          Practice hub
        </Chip>
        <h1 className="text-4xl font-serif capitalize">{lessonTitle}</h1>
        <p className="text-lg text-ink/70">Choose an activity below—record your voice or try the mini quiz.</p>
      </header>

      <div role="tablist" aria-label="Practice activities" className="flex gap-3">
        <Button
          variant={tab === 'pronunciation' ? 'primary' : 'ghost'}
          size="md"
          onClick={() => setTab('pronunciation')}
          leadingIcon={<Icon name="mic" size={18} />}
        >
          Pronunciation
        </Button>
        <Button
          variant={tab === 'quiz' ? 'primary' : 'ghost'}
          size="md"
          onClick={() => setTab('quiz')}
          leadingIcon={<Icon name="practice" size={18} />}
        >
          Quiz
        </Button>
      </div>

      {tab === 'pronunciation' ? (
        <Card className="border border-ink/10 bg-white/85" bodyClassName="space-y-6">
          <p className="text-lg text-ink/70">Press record, say the greeting slowly, then submit. We’ll sync when you’re back online.</p>
          <AudioRecorder lessonId={params.lessonId} onSubmit={handleRecordingSubmit} />
        </Card>
      ) : (
        <Card className="border border-ink/10 bg-white/85" bodyClassName="space-y-6">
          <p className="text-lg text-ink/70">Answer each question to unlock a celebration. Use the tone keypad for Yorùbá spelling.</p>
          <QuizBlock
            items={QUIZ_BANK}
            onComplete={(score) => {
              if (score === 100) {
                push({ title: 'Ìyìn! 100%', description: 'You earned today’s tortoise badge.', tone: 'success' });
              }
            }}
          />
        </Card>
      )}
    </motion.div>
  );
}
