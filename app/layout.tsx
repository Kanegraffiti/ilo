import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import { Noto_Sans, Noto_Serif } from 'next/font/google';
import InstallPrompt from '@/components/InstallPrompt';

const sans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Noto_Serif({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Ìlọ̀',
  description: 'Learn Yoruba the fun way.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
        <InstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});});}",
          }}
        />
      </body>
    </html>
  );
}
