/// <reference lib="webworker" />

const swSelf = self as unknown as ServiceWorkerGlobalScope;

swSelf.addEventListener('install', () => {
  console.log('Service Worker installed');
  swSelf.skipWaiting().then(() => {
  });
});

swSelf.addEventListener('activate', () => {
  console.log('Service Worker activated');
});

swSelf.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('image-cache').then((cache) =>
        cache.match(event.request).then((response) =>
            response || fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone()).then(() => {
              });
              return networkResponse;
            })
        )
      )
    );
  }
});
