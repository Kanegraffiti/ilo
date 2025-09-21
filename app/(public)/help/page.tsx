'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

const FAQ = [
  {
    question: 'How do I reset my child’s streak?',
    answer: 'Reach out via the form below—we can reset streaks while keeping earned badges safe.',
  },
  {
    question: 'Can teachers join the beta?',
    answer: 'Yes, educators can request access to our classroom view with lesson planning tools.',
  },
  {
    question: 'Which browsers work best?',
    answer: 'Ìlọ̀ supports modern browsers on mobile and desktop. Chrome, Safari, Edge, and Firefox all work great.',
  },
];

export default function HelpPage() {
  const { push } = useToast();
  const pageMotion = usePageEnter();
  const [formState, setFormState] = useState({ name: '', email: '', topic: 'support', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    push({
      title: 'Ẹ ṣe! We got your message.',
      description: 'Our team will reply within one school day.',
      tone: 'success',
    });
    setSubmitting(false);
    setFormState({ name: '', email: '', topic: 'support', message: '' });
  };

  return (
    <motion.div {...pageMotion} className="space-y-10 bg-paper c-on-paper">
      <div className="space-y-3">
        <Chip tone="accent" size="sm">
          We’re here for you
        </Chip>
        <h1 className="text-4xl font-serif">Help & contact</h1>
        <p className="text-xl opacity-80">
          Guardians, teachers, and kids deserve quick answers. Reach out—ọ̀nà ọ̀kan ṣoṣo ni a fi ń kọ́ àkọ́kọ́.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card
          bodyClassName="space-y-6"
          header={<span className="text-2xl font-serif">Send us a note</span>}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Your name"
              required
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              required
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Select
              label="Topic"
              value={formState.topic}
              onChange={(event) => setFormState((prev) => ({ ...prev, topic: event.target.value }))}
            >
              <option value="support">Guardian support</option>
              <option value="curriculum">Curriculum question</option>
              <option value="teacher">Teacher beta</option>
            </Select>
            <div className="space-y-2">
              <label htmlFor="message" className="block text-base font-semibold">
                Message
              </label>
              <textarea
                id="message"
                required
                minLength={10}
                className="min-h-[160px] w-full rounded-2xl border border-[var(--border)] bg-surface-1 c-on-surface-1 p-4 text-lg shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30"
                value={formState.message}
                onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
              />
              <p className="text-sm opacity-70">Share as much detail as you like—ẹ ṣeun!</p>
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </Card>
        <Card bodyClassName="space-y-4" header={<span className="text-2xl font-serif">Quick answers</span>}>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.question} className="rounded-2xl border border-[var(--border)] p-4">
                <summary className="cursor-pointer text-lg font-semibold">{item.question}</summary>
                <p className="pt-3 text-lg opacity-80">{item.answer}</p>
              </details>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
