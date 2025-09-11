import * as React from 'react';

export function AccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="border-b py-4">
      <summary className="cursor-pointer font-medium">{question}</summary>
      <p className="mt-2 text-sm">{answer}</p>
    </details>
  );
}
