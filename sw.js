// 아사나 산스크리트어 암기: 오프라인 캐시
const CACHE = "asana-sanskrit-v3";
const FILES = ["./", "./index.html", "./list.html", "./print.html", "./dict.html", "./app/", "./app/index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./file/asana-sanskrit-print.pdf", "./fonts/p400.woff2", "./fonts/p500.woff2", "./fonts/p600.woff2", "./fonts/p700.woff2", "./fonts/p800.woff2"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 새 버전이 있으면 받아 오고, 인터넷이 없으면 저장된 것을 보여 줌
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
