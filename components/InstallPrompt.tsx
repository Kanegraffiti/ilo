'use client';
import React, { useEffect, useState } from 'react';

let deferredPrompt: any = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();
    deferredPrompt = e;
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
  });
}

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const before = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setPromptEvent(e);
    };
    if (deferredPrompt) setPromptEvent(deferredPrompt);
    const installedHandler = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', before);
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', before);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  if (installed || !promptEvent) return null;

  const install = async () => {
    promptEvent.prompt();
    await promptEvent.userChoice;
    deferredPrompt = null;
    setPromptEvent(null);
  };

  return (
    <button className="px-4 py-2 bg-accent text-paper" onClick={install} aria-label="Install app">
      Install App
    </button>
  );
}
