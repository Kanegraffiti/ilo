'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useId, useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ConfettiOnce } from './ConfettiOnce';
import { ToneKeypad } from './ToneKeypad';

export type QuizItem =
  | {
      id: string;
      type: 'mcq';
      prompt: string;
      choices: { id: string; label: string }[];
      answer: string;
      hint?: string;
    }
  | {
      id: string;
      type: 'text';
      prompt: string;
      answer: string;
      hint?: string;
    };

export interface QuizBlockProps {
  items: QuizItem[];
  className?: string;
  onComplete?: (score: number) => void;
}

export function QuizBlock({ items, className, onComplete }: QuizBlockProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const idPrefix = useId();
  const { push } = useToast();

  const handleSelect = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const total = items.length;
    if (total === 0) return;

    let correct = 0;
    for (const item of items) {
      const answer = responses[item.id]?.trim().toLowerCase();
      const expected = item.answer.trim().toLowerCase();
      if (answer && answer === expected) {
        correct += 1;
      }
    }

    const calculatedScore = Math.round((correct / total) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    onComplete?.(calculatedScore);
    push({
      title: calculatedScore === 100 ? 'Fantastìkì! 🎉' : 'Ìdáhùn rẹ̀ ti dé',
      description:
        calculatedScore === 100
          ? 'O ṣe aṣeyọrí pipe — ẹ̀ kí o!'
          : `O kó ${calculatedScore}% jọ. Gbìmọ̀ síi, ìrẹ̀lẹ̀ ni ọ̀nà àṣẹ̀yẹ!`,
      tone: calculatedScore === 100 ? 'success' : 'info',
    });
  };

  const handleReset = () => {
    setResponses({});
    setSubmitted(false);
    setScore(0);
  };

  const feedbackById = useMemo(() => {
    if (!submitted) return {} as Record<string, boolean>;
    const result: Record<string, boolean> = {};
    for (const item of items) {
      const answer = responses[item.id]?.trim().toLowerCase();
      result[item.id] = answer === item.answer.trim().toLowerCase();
    }
    return result;
  }, [submitted, items, responses]);

  return (
    <div className={cn('space-y-6', className)}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-serif">Quiz time</h3>
          <p className="text-lg opacity-80">Answer and see feedback immediately.</p>
        </div>
        {submitted ? <Chip tone={score === 100 ? 'accent' : 'secondary'}>{score}% correct</Chip> : null}
      </header>
      <div className="space-y-4">
        {items.map((item, index) => {
          const feedback = feedbackById[item.id];
          return (
            <Card
              key={item.id}
              header={<span className="flex items-center gap-2 text-lg">{index + 1}. {item.prompt}</span>}
            >
              {item.type === 'mcq' ? (
                <div className="space-y-3">
                  {item.choices.map((choice) => {
                    const isSelected = responses[item.id] === choice.id;
                    const isCorrect = submitted && choice.id === item.answer;
                    const isIncorrect = submitted && isSelected && choice.id !== item.answer;
                    return (
                      <motion.label
                        key={choice.id}
                        className={cn(
                          'flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-[var(--border)] bg-surface-1 c-on-surface-1 px-4 py-3 text-lg transition focus-within:outline-none focus-within:ring-4 focus-within:ring-[var(--color-accent)]/40',
                          isCorrect ? 'border-secondary bg-secondary c-on-secondary' : null,
                          isIncorrect ? 'border-[var(--color-accent)] bg-accent c-on-accent' : null,
                        )}
                        htmlFor={`${idPrefix}-${item.id}-${choice.id}`}
                      >
                        <input
                          type="radio"
                          id={`${idPrefix}-${item.id}-${choice.id}`}
                          name={`${idPrefix}-${item.id}`}
                          value={choice.id}
                          checked={isSelected}
                          onChange={() => handleSelect(item.id, choice.id)}
                          className="h-5 w-5 border-2 border-[var(--border)] text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                        />
                        <span>{choice.label}</span>
                        {submitted ? (
                          <span className="ml-auto flex items-center gap-1 text-sm">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Ìbáṣepọ̀!
                              </>
                            ) : isIncorrect ? (
                              <>
                                <XCircle className="h-5 w-5" aria-hidden="true" /> Tun gbìmọ̀!
                              </>
                            ) : null}
                          </span>
                        ) : null}
                      </motion.label>
                    );
                  })}
                  {item.hint ? <p className="text-sm opacity-70">Ìmọ̀ràn: {item.hint}</p> : null}
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    id={`${idPrefix}-${item.id}-input`}
                    value={responses[item.id] ?? ''}
                    onChange={(event) => handleSelect(item.id, event.target.value)}
                    helperText={submitted ? (feedback ? 'Ìbáṣepọ̀! 🎉' : 'Ṣe àtúnṣe kí o ṣàṣeyọrí.') : item.hint}
                    aria-describedby={submitted ? `${idPrefix}-${item.id}-feedback` : undefined}
                  />
                  <ToneKeypad targetId={`${idPrefix}-${item.id}-input`} />
                </div>
              )}
              {submitted ? (
                <p
                  id={`${idPrefix}-${item.id}-feedback`}
                  className={cn('text-lg font-semibold', feedback ? 'text-[var(--color-secondary)]' : 'text-[var(--color-accent)]')}
                >
                  {feedback ? 'Ẹ ṣe! Ìdáhùn tó pé.' : `Kí lo rò pé “${item.answer}” túmọ̀ sí?`}
                </p>
              ) : null}
            </Card>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSubmit}>Check answers</Button>
        <Button variant="ghost" onClick={handleReset}>
          Clear answers
        </Button>
      </div>
      <ConfettiOnce trigger={submitted && score === 100} />
    </div>
  );
}
