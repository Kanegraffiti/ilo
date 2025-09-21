'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCardPop, usePrefersReducedMotion } from '@/lib/anim';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
}

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const cardMotion = useCardPop();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setInstalled(Boolean(standalone));

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setDismissed(true);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const eligible = useMemo(() => !installed && !dismissed, [installed, dismissed]);
  const ready = Boolean(promptEvent);

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome !== 'accepted') {
      setDismissed(true);
    }
    setPromptEvent(null);
  };

  if (!eligible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div {...(!reduced ? cardMotion : {})}>
        <Card className="max-w-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary c-on-primary text-4xl" aria-hidden="true">
              🐢
            </div>
            <div className="space-y-2 text-left">
              <h3 className="text-2xl font-serif">Install Ìlọ̀ for quick learning</h3>
              <p className="text-lg opacity-80">
                Save the app to your device to learn Yorùbá even when you’re offline.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleInstall} pulse disabled={!ready}>
                  Install App
                </Button>
                <Button variant="ghost" onClick={() => setDismissed(true)}>
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
