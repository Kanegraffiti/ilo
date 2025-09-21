'use client';

import { AuthCard } from '@/components/ui/AuthCard';
import { Button } from '@/components/ui/Button';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';
import { LogIn, Sparkles } from 'lucide-react';

const cards = [
  {
    title: 'Log in',
    description: 'Sign in quickly with a magic link or your password to get back to learning.',
    icon: <LogIn className="h-7 w-7" aria-hidden="true" />,
    eyebrow: 'Returning families',
    cta: (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/auth/login">Go to login</Button>
        <Button variant="secondary">Send Magic Link</Button>
      </div>
    ),
  },
  {
    title: 'Create account',
    description: 'Set up a guardian account so you can add child profiles and track joyful progress.',
    icon: <Sparkles className="h-7 w-7" aria-hidden="true" />,
    eyebrow: 'New here?',
    cta: (
      <Button href="/auth/signup" variant="secondary">
        Start sign up
      </Button>
    ),
  },
];

export default function AuthGatewayPage() {
  const motionProps = usePageEnter();

  return (
    <motion.div
      {...motionProps}
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 py-6"
    >
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-serif c-on-paper">Pick how you’d like to sign in</h1>
        <p className="max-w-2xl text-lg leading-relaxed c-on-paper">
          Guardians and kids stay safe with our secure magic links and optional passwords.
        </p>
      </header>
      <div className="grid w-full gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <AuthCard
            key={card.title}
            title={card.title}
            description={card.description}
            icon={card.icon}
            eyebrow={card.eyebrow}
            action={card.cta}
          />
        ))}
      </div>
    </motion.div>
  );
}
