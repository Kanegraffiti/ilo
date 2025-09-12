import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// The manifest array is injected by workbox at build time
precacheAndRoute(self.__WB_MANIFEST);

// Cache-first for static assets
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'style' || request.destination === 'script',
  new CacheFirst({ cacheName: 'static-assets' })
);

// Stale-while-revalidate for API
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({ cacheName: 'api' })
);

// Offline fallback for lessons
const offlineFallback = async () => new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/html' } });
const navigationHandler = async (params: any) => {
  try {
    return await params.event.preloadResponse || await fetch(params.request);
  } catch (e) {
    return offlineFallback();
  }
};
registerRoute(new NavigationRoute(navigationHandler));

// Background sync queue for submissions
const bgSyncPlugin = new BackgroundSyncPlugin('submissions', {
  maxRetentionTime: 24 * 60,
});
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/submissions'),
  new StaleWhileRevalidate({ plugins: [bgSyncPlugin] }),
  'POST'
);

self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
