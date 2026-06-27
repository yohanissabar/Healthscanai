
const CACHE_NAME = 'healthscan-premium-v2';

const ASSETS_TO_CACHE = [

  './',

  './index.html',

  './manifest.json',

  './icon-192.png',

  './icon-512.png',

  './css/main.css',

  './js/main.js',

  './js/store.js',

  './js/utils.js',

  './js/pwa.js',

  './js/ai-engine.js',

  './js/scanner.js',

  './js/pdf-report.js',

  './js/modules/tremor.js',

  './js/modules/respiratory.js',

  './js/modules/cognitive.js',

  './js/modules/visual.js',

  './js/modules/bmi.js',

  './js/modules/audiometry.js',

  './js/modules/colorblind.js',

  'https://cdn.tailwindcss.com',

  'https://cdn.jsdelivr.net/npm/chart.js',

  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',

  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',

  'https://unpkg.com/lucide@latest'

];



self.addEventListener('install', (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))

  );

  self.skipWaiting();

});



self.addEventListener('activate', (event) => {

  event.waitUntil(

    caches.keys().then((cacheNames) => {

      return Promise.all(

        cacheNames.map((cache) => {

          if (cache !== CACHE_NAME) return caches.delete(cache);

        })

      );

    })

  );

  self.clients.claim();

});



self.addEventListener('fetch', (event) => {

  event.respondWith(

    caches.match(event.request).then((cachedResponse) => {

      const fetchPromise = fetch(event.request).then((networkResponse) => {

        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {

            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));

        }

        return networkResponse;

      }).catch(() => console.log('[SW] Network failed. Serving offline cache.'));

      return cachedResponse || fetchPromise;

    })

  );

});

