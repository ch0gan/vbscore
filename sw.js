// Service worker: lets the app open and run with no internet connection.
//
// Strategy: answer every request from the cache right away (fast, works offline),
// then fetch a fresh copy in the background for next time. So after you push
// changes, the app shows them the second time it is opened.
//
// Bump CACHE_NAME if you ever need to force every phone to drop its old copy.
const CACHE_PREFIX = 'vbscore-';
const CACHE_NAME = CACHE_PREFIX + 'v1';

// The app's own files. All of these must download or the install fails.
const APP_FILES = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png'
];

// Files from other sites (the switch-sides icon font). Cached if they download,
// but a failure here does not stop the app from working offline.
const OPTIONAL_FILES = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES).then(() =>
                Promise.allSettled(OPTIONAL_FILES.map(url => cache.add(url)))
            ))
            .then(() => self.skipWaiting())
    );
});

// Remove this app's caches from older versions. Leave other apps' caches alone.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(
                names
                    .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const cacheOpened = caches.open(CACHE_NAME);
    const cached = cacheOpened.then(cache =>
        cache.match(request, { ignoreSearch: request.mode === 'navigate' })
    );

    // Download a fresh copy and save it. The save finishes before the promise resolves.
    const fresh = cacheOpened.then(cache =>
        fetch(request).then(response => {
            if (!response.ok) return response;
            return cache.put(request, response.clone()).then(() => response);
        })
    );

    // Keep the worker alive until the background download is saved.
    event.waitUntil(fresh.catch(() => {}));

    // Answer from the cache if we have it; otherwise wait for the network.
    event.respondWith(
        cached.then(hit => hit || fresh.catch(() => Response.error()))
    );
});
