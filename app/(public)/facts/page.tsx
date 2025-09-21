'use client';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';
import { useState } from 'react';

type Fact = {
  id: string;
  emoji: string;
  title: string;
  summary: string;
  content: string;
};

const FACTS: Fact[] = [
  {
    id: 'drums',
    emoji: '🥁',
    title: 'Talking drums speak Yorùbá tones',
    summary: 'Gángan drums can mimic speech—players match rising and falling tones to send messages.',
    content:
      'Gángan players squeeze the drum to raise and lower the pitch, copying Yorùbá tones. Villages still send greetings and warnings this way—children love calling out “Ẹ káàárọ̀!” with the rhythm.',
  },
  {
    id: 'tortoise',
    emoji: '🐢',
    title: 'Ijapa the storyteller',
    summary: 'The clever tortoise appears in folktales teaching patience, respect, and wit.',
    content:
      'Ijapa the tortoise often learns the hard way—bragging, rushing, or being too sneaky. Each story ends with a gentle proverb such as “Sùúrù ni baba ìwà,” patience shapes good character.',
  },
  {
    id: 'greetings',
    emoji: '🌅',
    title: 'Greetings change with the time of day',
    summary: 'Ẹ káàárọ̀ (good morning) becomes Ẹ káàsán (good afternoon) and Ẹ káalẹ́ (good evening).',
    content:
      'We greet elders first and with a smile. Kids can add a polite bow or curtsy. Guardians can ask children to practice the tones slowly—Ẹ káàárọ̀, Ẹ káàsán, Ẹ káalẹ́.',
  },
];

export default function FactsPage() {
  const pageMotion = usePageEnter();
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);

  return (
    <motion.div {...pageMotion} className="space-y-10 bg-paper c-on-paper">
      <div className="space-y-3">
        <Chip tone="secondary" size="sm">
          Yorùbá fun fact archive
        </Chip>
        <h1 className="text-4xl font-serif">Small facts with big smiles</h1>
        <p className="text-xl opacity-80">Share these with your learners during breakfast or the ride home.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {FACTS.map((fact) => (
          <Card
            key={fact.id}
            className="h-full"
            bodyClassName="space-y-4"
            header={
              <span className="flex items-center gap-3 text-xl font-serif">
                <span className="text-3xl" aria-hidden="true">
                  {fact.emoji}
                </span>
                {fact.title}
              </span>
            }
          >
            <p className="text-lg opacity-80">{fact.summary}</p>
            <Button variant="secondary" size="md" onClick={() => setSelectedFact(fact)}>
              Read more
            </Button>
          </Card>
        ))}
      </div>
      <Modal
        isOpen={Boolean(selectedFact)}
        onClose={() => setSelectedFact(null)}
        title={selectedFact?.title ?? ''}
        description=""
        actions={
          <Button variant="ghost" onClick={() => setSelectedFact(null)}>
            Close
          </Button>
        }
      >
        <p className="text-lg opacity-90">{selectedFact?.content}</p>
      </Modal>
    </motion.div>
  );
}
