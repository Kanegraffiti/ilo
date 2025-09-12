"use client";

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import InstallPrompt from '@/components/InstallPrompt';
import { motion } from 'framer-motion';
import { usePageEnter } from '@/lib/anim';

export default function LandingPage() {
  const page = usePageEnter();
  return (
    <motion.div {...page} className="p-8 flex flex-col items-center text-center gap-8">
      <h1 className="text-4xl font-serif">Ìlọ̀</h1>
      <p className="text-xl">Let’s learn!</p>
      <Button size="xl">Get Started</Button>
      <div className="grid md:grid-cols-3 gap-4 w-full max-w-4xl">
        {['Lessons', 'Quizzes & Badges', 'Culture Stories'].map((t) => (
          <Card key={t} className="p-6">
            <h2 className="font-bold text-xl mb-2">{t}</h2>
            <p className="text-ink/80 text-sm">Short description.</p>
          </Card>
        ))}
      </div>
      <InstallPrompt />
    </motion.div>
  );
}
