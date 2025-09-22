import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import { headers } from 'next/headers';
import { Noto_Sans, Noto_Serif } from 'next/font/google';
import { ToastProvider, ToastViewport } from '@/components/ui/Toast';
import FloatingAssistant from '@/components/floating-assistant';

const sans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Noto_Serif({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Ìlọ̀',
  description: 'Learn Yoruba the fun way.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = headers();
  const theme = headerList.get('x-ilo-theme');

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} data-theme={theme ?? undefined}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <ToastProvider>
          {children}
          <ToastViewport />
          <FloatingAssistant />
        </ToastProvider>
      </body>
    </html>
  );
}
