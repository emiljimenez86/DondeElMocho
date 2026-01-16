const CACHE_NAME = "donde-el-mocho-cache-v1";
const urlsToCache = [
    "./index.html",
    "./styles.css",
    "./imagenes/logo-app.png"
];

// Instalación: Cachea recursos iniciales
self.addEventListener("install", (event) => {
    console.log("Service Worker instalado");
    // Fuerza la activación inmediata del nuevo Service Worker
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activación: Limpia caches antiguos
self.addEventListener("activate", (event) => {
    console.log("Service Worker activado");
    // Toma control de todas las páginas inmediatamente
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("Eliminando cache antiguo:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Toma control de todas las páginas abiertas
            return self.clients.claim();
        })
    );
});

// Fetch: Estrategia "Network First" con fallback a cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la petición es exitosa, actualiza el cache
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Si falla la red, intenta obtener del cache
                return caches.match(event.request);
            })
    );
});
