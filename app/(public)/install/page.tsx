'use client';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

const STEPS = [
  {
    id: 'ios',
    platform: 'iPhone & iPad',
    instructions: [
      'Tap the share icon in Safari.',
      'Scroll and choose “Add to Home Screen.”',
      'Confirm “Ìlọ̀” and tap Add. Launch from your home screen anytime!'
    ],
  },
  {
    id: 'android',
    platform: 'Android',
    instructions: [
      'Open Ìlọ̀ in Chrome and tap the ⋮ menu.',
      'Select “Install app.”',
      'Look for the tortoise icon on your home screen and dive back in.'
    ],
  },
  {
    id: 'desktop',
    platform: 'Desktop & Chromebook',
    instructions: [
      'Open Ìlọ̀ in Chrome, Edge, or Safari.',
      'Click the install icon in the address bar.',
      'Pin Ìlọ̀ to your dock or taskbar for quick study sessions.'
    ],
  },
];

export default function InstallPage() {
  const pageMotion = usePageEnter();

  return (
    <motion.div {...pageMotion} className="space-y-10">
      <div className="space-y-3">
        <Chip tone="accent" size="sm">
          Ready to install?
        </Chip>
        <h1 className="text-4xl font-serif">Keep Ìlọ̀ one tap away</h1>
        <p className="text-xl text-ink/70">
          Add the PWA to your device and keep lessons cached for offline adventures. No app store required.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <Card
            key={step.id}
            className="border border-ink/10 bg-white/85"
            bodyClassName="space-y-4"
            header={<span className="text-xl font-serif">{step.platform}</span>}
          >
            <ol className="space-y-3 text-lg text-ink/80">
              {step.instructions.map((text, index) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
      <Card className="border border-ink/10 bg-secondary/10" bodyClassName="space-y-3">
        <h2 className="text-2xl font-serif">Pro tip for guardians</h2>
        <p className="text-lg text-ink/80">
          After installing, open Ìlọ̀ once with Wi-Fi so new lessons download. When your child taps the tortoise offline, cached stories, vocabulary, and quizzes stay ready.
        </p>
      </Card>
    </motion.div>
  );
}
