"use client";
import './globals.css';
import type { Metadata } from 'next';
import React, { useEffect } from 'react';
import { Inter, Nunito } from 'next/font/google';
import { enableClickDebug } from '@/lib/clickDebug';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });

export const metadata: Metadata = {
  title: 'Ìlọ̀',
  description: 'Learn Yoruba the fun way.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    enableClickDebug();
  }, []);
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
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
