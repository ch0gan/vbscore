// Service worker: lets the app open and run with no internet connection.
//
// Strategy: answer every request from the cache right away (fast, works offline),
// then fetch a fresh copy in the background for next time. So after you push
// changes, the app shows them the second time it is opened.
//
// Bump CACHE_NAME if you ever need to force every phone to drop its old copy.
const CACHE_NAME = 'vbscore-v1';

const APP_FILES = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

// Remove caches from older versions
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(
                names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(event.request, { ignoreSearch: event.request.mode === 'navigate' }).then(cached => {
                const fresh = fetch(event.request)
                    .then(response => {
                        if (response.ok) cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => cached);
                return cached || fresh;
            })
        )
    );
});
