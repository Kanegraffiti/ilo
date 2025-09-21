const CACHE_NAME = 'ilo-offline-v1';
const OFFLINE_ROUTES = ['/', '/lessons/1'];
const OFFLINE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Ìlọ̀ offline</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, sans-serif; padding: 2.5rem; line-height: 1.6; background: #f4e7cd; color: #2f1b0c; }
      main { max-width: 32rem; margin: 0 auto; }
      h1 { font-size: 2rem; margin-bottom: 0.75rem; }
      p { margin-bottom: 1rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Offline</h1>
      <p>You can keep exploring Ìlọ̀ once your connection returns. Cached lessons stay ready.</p>
    </main>
  </body>
</html>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_ROUTES))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return undefined;
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) {
        return cached;
      }
      if (event.request.mode === 'navigate') {
        const offline = await cache.match('/');
        return offline ?? new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
      throw new Error('offline');
    }),
  );
});
