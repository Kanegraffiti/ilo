'use client';

import { Card } from '@/components/ui/Card';
import { useEffect, useState } from 'react';

export function OfflineNotice() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (online) return null;

  return (
    <Card className="border border-dashed border-accent/40 bg-accent/10" bodyClassName="space-y-2">
      <h2 className="text-lg font-semibold text-ink">Offline mode</h2>
      <p className="text-ink/70">Text is ready from cache. Media will appear when you’re back online.</p>
    </Card>
  );
}
