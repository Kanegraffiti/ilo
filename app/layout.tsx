import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import { headers } from 'next/headers';
import { Noto_Sans, Noto_Serif } from 'next/font/google';
import { ToastProvider, ToastViewport } from '@/components/ui/Toast';

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
        <link rel="prefetch" href="/lessons/1" as="document" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(() => { try { const original = window.getComputedStyle; if (!original) return; window.getComputedStyle = function(element, ...rest) { const style = original.call(this, element, ...rest); if (!style) { return style; } return new Proxy(style, { get(target, prop, receiver) { if (prop === 'borderRadius') { const computed = target.getPropertyValue('border-radius'); if (computed && computed.trim()) { return computed; } const attr = element && element.getAttribute ? element.getAttribute('data-radius-px') : null; return attr ? `${attr}px` : computed; } return Reflect.get(target, prop, receiver); }, }); }; } catch (error) { console.warn('[ilo] borderRadius shim failed', error); } })();",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(() => undefined); }",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(() => { if ('navigation' in window && window.navigation && 'addEventListener' in window.navigation) { const offlineHtml = '<!doctype html><html lang=\\'en\\'><head><meta charset=\\'utf-8\\'/><title>Ìlọ̀ offline</title><meta name=\\'viewport\\' content=\\'width=device-width, initial-scale=1\\'/><style>body{font-family:system-ui,sans-serif;padding:2.5rem;line-height:1.6;background:#f4e7cd;color:#2f1b0c;}main{max-width:32rem;margin:0 auto;}h1{font-size:2rem;margin-bottom:0.75rem;}p{margin-bottom:1rem;}</style></head><body><main><h1>Offline</h1><p>You can keep exploring Ìlọ̀ once your connection returns. Cached lessons stay ready.</p></main></body></html>'; window.navigation.addEventListener('navigate', (event) => { try { const destination = event.destination && event.destination.url ? event.destination.url : ''; if (!navigator.onLine && destination.includes('/lessons/')) { event.intercept({ handler: () => new Response(offlineHtml, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }) }); } } catch (error) { /* ignore */ } }); } })();",
          }}
        />
      </head>
      <body className="bg-paper c-on-paper">
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
