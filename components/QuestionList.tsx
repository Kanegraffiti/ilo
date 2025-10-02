'use client';

import { useCardPop } from '@/lib/anim';
import { motion } from 'framer-motion';

export interface QuestionItem {
  id: string;
  question: string;
  createdAt?: string;
  answer?: string | null;
  answeredAt?: string | null;
  askedBy?: string | null;
  answeredByName?: string | null;
}

interface QuestionListProps {
  questions: QuestionItem[];
  className?: string;
}

export function QuestionList({ questions, className }: QuestionListProps) {
  const cardPop = useCardPop();

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/10 bg-surface-50/80 p-6 text-center text-sm text-ink/70">
        No questions yet. Encourage students to ask!
      </div>
    );
  }

  return (
    <div className={className ?? 'space-y-4'}>
      {questions.map((item) => (
        <motion.article
          key={item.id}
          {...cardPop}
          className="space-y-3 rounded-2xl border border-ink/10 bg-white/95 p-5 shadow-sm"
        >
          <header className="flex items-center justify-between text-xs text-ink/60">
            <span>{item.askedBy ?? 'Learner'}</span>
            {item.createdAt ? <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time> : null}
          </header>
          <p className="text-base font-medium text-ink">{item.question}</p>
          {item.answer ? (
            <div className="rounded-2xl bg-primary/5 p-4 text-sm text-ink/90">
              <p className="font-semibold text-primary">Answered by {item.answeredByName ?? 'Teacher'}</p>
              <p className="mt-2 whitespace-pre-line">{item.answer}</p>
              {item.answeredAt ? (
                <time className="mt-2 block text-xs text-ink/60" dateTime={item.answeredAt}>
                  {new Date(item.answeredAt).toLocaleString()}
                </time>
              ) : null}
            </div>
          ) : (
            <p className="text-sm font-semibold text-warning">Awaiting response</p>
          )}
        </motion.article>
      ))}
    </div>
  );
}
