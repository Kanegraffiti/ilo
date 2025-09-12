'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const send = async () => {
    const parsed = schema.safeParse({ email });
    if (!parsed.success) return alert('Enter a valid email');
    await fetch('/api/auth/magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-serif">Sign in</h1>
      {sent ? (
        <p className="text-center">Check your email for a magic link.</p>
      ) : (
        <form
          className="w-full max-w-sm flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            aria-label="Email address"
            className="h-11 rounded-2xl border px-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Send magic link</Button>
        </form>
      )}
    </div>
  );
}
