self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('eswa-tickets-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/organizer',
        '/organizer/register',
        '/organizer/login',
        '/organizer/dashboard',
        '/organizer/events',
        '/organizer/tickets',
        '/organizer/vendors',
        '/organizer/analytics',
        '/organizer/marketing',
        '/organizer/settings',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
