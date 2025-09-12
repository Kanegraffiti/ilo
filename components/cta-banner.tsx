'use client';
import { Button } from '@/components/ui/Button';
import { useAnalytics } from '@/lib/analytics';

export default function CTABanner() {
  const { track } = useAnalytics();
  return (
    <div className="bg-brand text-white py-8 text-center">
      <h2 className="font-display text-2xl mb-4">Install Ìlọ̀ PWA</h2>
      <Button variant="secondary" onClick={() => track('install_pwa')}>
        Install now
      </Button>
    </div>
  );
}
