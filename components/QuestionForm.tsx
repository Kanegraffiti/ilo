'use client';

import { questionCreateSchema } from '@/lib/zodSchemas';
import { useState } from 'react';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { ToneKeypad } from './ToneKeypad';

interface QuestionFormProps {
  lessonId: string;
  ownerKind: 'user' | 'child';
  ownerId: string;
  onSubmitted?: () => void;
}

export function QuestionForm({ lessonId, ownerKind, ownerId, onSubmitted }: QuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsed = questionCreateSchema.safeParse({ lessonId, ownerKind, ownerId, question });
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      setError(flattened.formErrors[0] || 'Please enter a question.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/questions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.message || 'Unable to submit question right now.');
      } else {
        setQuestion('');
        setMessage('Question sent!');
        onSubmitted?.();
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="lesson-question" className="text-sm font-semibold text-ink">
          Ask a question
        </label>
        <TextArea
          id="lesson-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ẹ̀kọ́ yi ò ye mi, ẹ jọ̀wọ́?"
        />
        <ToneKeypad onInsert={(value) => setQuestion((prev) => `${prev}${value}`)} targetId="lesson-question" />
      </div>
      {error ? <p className="rounded-2xl bg-error/10 px-4 py-2 text-sm font-semibold text-error">{error}</p> : null}
      {message ? <p className="rounded-2xl bg-success/10 px-4 py-2 text-sm font-semibold text-success">{message}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send question'}
        </Button>
      </div>
    </form>
  );
}
