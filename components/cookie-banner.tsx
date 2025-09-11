'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 p-4 bg-cream border-t text-sm flex items-center justify-between">
      <p>We use cookies to improve your experience.</p>
      <button
        className="underline"
        onClick={() => {
          localStorage.setItem('cookie-consent', 'true');
          setShow(false);
        }}
      >
        Got it
      </button>
    </div>
  );
}
