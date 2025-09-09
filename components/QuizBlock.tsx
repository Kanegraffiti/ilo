'use client';
import React, { useState } from 'react';
import ToneKeypad from './ToneKeypad';

type MCQ = {
  id: string;
  type: 'mcq';
  question: string;
  options: string[];
  answer: string;
};

type TextQ = {
  id: string;
  type: 'text';
  question: string;
  answer: string;
};

export type QuizItem = MCQ | TextQ;

export default function QuizBlock({ items }: { items: QuizItem[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, boolean>>({});

  const submit = () => {
    const res: Record<string, boolean> = {};
    for (const item of items) {
      res[item.id] = answers[item.id]?.trim().toLowerCase() === item.answer.trim().toLowerCase();
    }
    setResult(res);
  };

  return (
    <div className="space-y-4">
      {items.map((q) => (
        <div key={q.id} className="p-4 border rounded">
          <p className="mb-2">{q.question}</p>
          {q.type === 'mcq' ? (
            <div className="space-y-1">
              {q.options.map((o) => (
                <label key={o} className="block">
                  <input
                    type="radio"
                    name={q.id}
                    value={o}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    className="mr-2"
                  />
                  {o}
                </label>
              ))}
            </div>
          ) : (
            <div>
              <input
                className="border p-2 w-full mb-2"
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              />
              <ToneKeypad />
            </div>
          )}
          {result[q.id] !== undefined && (
            <p className={result[q.id] ? 'text-green-700' : 'text-red-700'}>
              {result[q.id] ? 'Correct' : 'Try again'}
            </p>
          )}
        </div>
      ))}
      <button className="px-4 py-2 bg-primary text-paper" onClick={submit} aria-label="Submit quiz">
        Submit
      </button>
    </div>
  );
}
