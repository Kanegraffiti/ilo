'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { usePageEnter } from '@/lib/anim';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<unknown>;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const anim = usePageEnter();

  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferred(evt);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;

  const install = async () => {
    await deferred?.prompt();
    await deferred?.userChoice;
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div {...anim} className="fixed bottom-4 left-4 right-4 z-40">
          <Card className="flex items-center justify-between">
            <span>Install Ìlọ̀?</span>
            <Button onClick={install} size="md">
              Install
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
