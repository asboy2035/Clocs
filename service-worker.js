// Cache name
const CACHE_NAME = 'clocs-cache';

// Files to cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/service-worker.js',
  '/Icons'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // If there is a cached response, return it
        return response;
      } else {
        // If there isn't a cached response, try to fetch the resource from the network
        return fetch(event.request).then((networkResponse) => {
          // If the network response is successful, cache it
          if (networkResponse.ok) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          } else {
            // If the network response isn't successful, return an error
            return networkResponse;
          }
        });
      }
    })
  );
});