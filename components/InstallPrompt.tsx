'use client';
import React, { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const before = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
    };
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
    setPromptEvent(null);
  };

  return (
    <button className="px-4 py-2 bg-accent text-paper" onClick={install} aria-label="Install app">
      Install App
    </button>
  );
}
