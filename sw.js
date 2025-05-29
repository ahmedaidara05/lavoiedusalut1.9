self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                '/logo.png'
            ]).catch(err => {
                console.warn('Failed to cache some resources:', err);
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                console.warn('Network fetch failed for:', event.request.url);
                return new Response('Resource unavailable offline', { status: 503 });
            });
        })
    );
});
