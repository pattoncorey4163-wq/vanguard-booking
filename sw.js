const CACHE_NAME = 'vanguard-pm-v1';
const urlsToCache = [
  '/vanguard-booking/',
  '/vanguard-booking/manifest.json',
  '/vanguard-booking/sw.js',
  'https://raw.githubusercontent.com/pattoncorey4163-wq/vanguard-booking/main/vanguard-logo-clean.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification support (for future booking confirmations)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'https://raw.githubusercontent.com/pattoncorey4163-wq/vanguard-booking/main/vanguard-logo-clean.png',
      badge: 'https://raw.githubusercontent.com/pattoncorey4163-wq/vanguard-booking/main/vanguard-logo-clean.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/vanguard-booking/'
      },
      actions: [
        {
          action: 'view',
          title: 'View Booking',
          icon: 'https://raw.githubusercontent.com/pattoncorey4163-wq/vanguard-booking/main/vanguard-logo-clean.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});