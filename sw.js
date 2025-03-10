self.addEventListener("install", (event) => {
    console.log("Service Worker instalado");
    event.waitUntil(
        caches.open("donde-el-mocho-cache").then((cache) => {
            return cache.addAll([
                "./index.html",
                "./styles.css",
                "./imagenes/logo-app.png"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
