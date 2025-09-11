'use client';
import { useEffect } from 'react';

export function useAnalytics() {
  const track = (event: string, data?: Record<string, any>) => {
    console.log('analytics', event, data);
  };

  useEffect(() => {
    track('pageview', { path: window.location.pathname });
  }, []);

  return { track };
}
