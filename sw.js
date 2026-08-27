self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('my-pwa-cache-v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        // أضف هنا أي ملفات أخرى مثل ملفات الـ CSS أو الصور التي تستخدمها
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
