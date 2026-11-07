// Service worker: lets the app open and run with no internet connection.
//
// The version comes from the address the page registers this worker with
// (sw.js?v=2026.11.06-2230). The page's CSS and JS addresses carry the same
// version, so each version's files are stored separately and never mixed up
// with an older copy kept by Cloudflare or the phone.
//
// Strategy:
//   - The page itself (index.html): try the internet first so updates show right
//     away; if there's no connection within a few seconds, use the saved copy.
//   - Everything else: use the saved copy if there is one, otherwise download it.
const APP_VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE_PREFIX = 'vbscore-';
const CACHE_NAME = CACHE_PREFIX + APP_VERSION;
const NETWORK_TIMEOUT_MS = 3000;

// The app's own files. All of these must download or the install fails.
const APP_FILES = [
    './',
    './styles.css?v=' + APP_VERSION,
    './script.js?v=' + APP_VERSION,
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
            .then(cache => cache.addAll(APP_FILES.map(url => new Request(url, { cache: 'no-cache' }))).then(() =>
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

// Download a fresh copy (checking with the server, not the browser's own cache) and save it
function fetchAndSave(cache, request, cacheKey) {
    return fetch(request, { cache: 'no-cache' }).then(response => {
        if (!response.ok) return response;
        return cache.put(cacheKey, response.clone()).then(() => response);
    });
}

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const cacheOpened = caches.open(CACHE_NAME);

    if (request.mode === 'navigate') {
        // The page: internet first, saved copy if offline or too slow
        // (fetch by address so redirects are followed normally)
        const fresh = cacheOpened.then(cache => fetchAndSave(cache, request.url, './'));
        event.waitUntil(fresh.catch(() => {}));

        const fromCache = () => cacheOpened.then(cache => cache.match('./'));
        const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS));

        event.respondWith(
            Promise.race([fresh.catch(() => null), timeout.then(() => null)])
                .then(response => (response && response.ok) ? response : fromCache())
                .then(response => response || fresh)
                .catch(() => Response.error())
        );
        return;
    }

    // Everything else: saved copy first, otherwise download and save it
    event.respondWith(
        cacheOpened.then(cache =>
            cache.match(request).then(hit => hit || fetchAndSave(cache, request, request))
        ).catch(() => Response.error())
    );
});
