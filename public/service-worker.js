const VERSION = "v6";   // Versión actualizada Zenith con Sync de Fotos y Logout Pro
const CACHE   = "aprende-utn-zenith-" + VERSION;

const ARCHIVOS = [
  "./",
  "index.html",
  "registro.html",
  "app.html",
  "offline.html",
  "manifest.json",
  "css/estilos.css",
  "js/firebase-config.js",
  "js/errores.js",
  "js/login.js",
  "js/registro.js",
  "js/app.js",
  "js/contenidos.js",
  "js/pwa.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/logo-zenith.png",
  "icons/favicon.png"
];

// ---- INSTALL: guardar archivos base en caché ----
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

// ---- ACTIVATE: borrar cachés de versiones anteriores ----
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(
        claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ---- FETCH: responder desde caché y actualizar en segundo plano ----
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url         = new URL(e.request.url);
  const propio      = url.origin === location.origin;
  const sdkFirebase = url.hostname === "www.gstatic.com";

  // Solo interceptamos recursos propios y el SDK de Firebase
  if (!propio && !sdkFirebase) return;

  e.respondWith(
    caches.match(e.request).then((guardado) => {
      // Actualización en segundo plano (stale-while-revalidate)
      const red = fetch(e.request)
        .then((resp) => {
          if (resp && resp.ok) {
            const copia = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copia));
          }
          return resp;
        })
        .catch(() =>
          // Sin red: devolver caché o página offline
          guardado ||
          (e.request.mode === "navigate"
            ? caches.match("offline.html")
            : Response.error())
        );

      return guardado || red;
    })
  );
});
