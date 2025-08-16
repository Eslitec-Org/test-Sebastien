/**
 * Service Worker for MantaGO Website
 * Provides offline capability, caching, and performance optimization
 */

const CACHE_NAME = 'mantago-v1.0.0';
const RUNTIME_CACHE = 'mantago-runtime-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/advanced-features.js',
    '/manifest.json',
    '/offline.html',
    // Font files
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
    // Icon fonts
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[ServiceWorker] Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                    })
                    .map((cacheName) => {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }

    // Handle different request types
    if (request.method === 'GET') {
        // HTML requests - Network First
        if (request.headers.get('accept').includes('text/html')) {
            event.respondWith(
                fetch(request)
                    .then((response) => {
                        // Clone the response before caching
                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                        return response;
                    })
                    .catch(() => {
                        return caches.match(request)
                            .then((response) => response || caches.match(OFFLINE_URL));
                    })
            );
            return;
        }

        // Static assets - Cache First
        if (isStaticAsset(request.url)) {
            event.respondWith(
                caches.match(request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        return fetch(request).then((response) => {
                            // Don't cache non-successful responses
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseToCache);
                            });
                            return response;
                        });
                    })
            );
            return;
        }

        // Images - Cache First with Runtime Cache
        if (request.destination === 'image') {
            event.respondWith(
                caches.match(request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        return fetch(request).then((response) => {
                            const responseToCache = response.clone();
                            caches.open(RUNTIME_CACHE).then((cache) => {
                                cache.put(request, responseToCache);
                            });
                            return response;
                        }).catch(() => {
                            // Return a placeholder image if offline
                            return new Response(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        });
                    })
            );
            return;
        }

        // API requests - Network First with timeout
        if (request.url.includes('/api/')) {
            event.respondWith(
                Promise.race([
                    fetch(request),
                    new Promise((resolve, reject) => 
                        setTimeout(() => reject(new Error('Network timeout')), 5000)
                    )
                ])
                .then((response) => {
                    const responseToCache = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
            );
            return;
        }

        // Default - Network First
        event.respondWith(
            fetch(request)
                .catch(() => caches.match(request))
        );
    }
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from MantaGO',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Learn More',
                icon: '/assets/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('MantaGO Update', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('https://mantago.cc')
        );
    }
});

// Message handler for cache updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName);
                    })
                );
            }).then(() => {
                return self.clients.matchAll();
            }).then((clients) => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'CACHE_CLEARED',
                        message: 'All caches have been cleared'
                    });
                });
            })
        );
    }
});

// Helper function to determine if URL is a static asset
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.json', '.woff', '.woff2', '.ttf', '.eot', '.svg'];
    return staticExtensions.some(ext => url.includes(ext));
}

// Helper function to sync contact form data
async function syncContactForm() {
    try {
        const cache = await caches.open(RUNTIME_CACHE);
        const requests = await cache.keys();
        const formRequests = requests.filter(request => 
            request.url.includes('/api/contact')
        );

        const promises = formRequests.map(async (request) => {
            const cachedResponse = await cache.match(request);
            const data = await cachedResponse.json();
            
            // Attempt to send the data
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // If successful, remove from cache
            if (response.ok) {
                await cache.delete(request);
            }

            return response;
        });

        return Promise.all(promises);
    } catch (error) {
        console.error('[ServiceWorker] Background sync failed:', error);
        throw error;
    }
}

// Performance monitoring
function measurePerformance() {
    if (performance && performance.measure) {
        performance.measure('sw-fetch', 'fetch-start', 'fetch-end');
        const measure = performance.getEntriesByName('sw-fetch')[0];
        console.log(`[ServiceWorker] Fetch took ${measure.duration}ms`);
    }
}

// Cache size management
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        // Delete oldest entries
        const keysToDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
    }
}

// Periodic cache cleanup (run every hour)
setInterval(() => {
    trimCache(RUNTIME_CACHE, 50);
}, 60 * 60 * 1000);

console.log('[ServiceWorker] Service Worker loaded successfully');