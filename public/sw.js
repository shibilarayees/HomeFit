// HomeFit service worker — offline caching + notification handling.
const CACHE = 'homefit-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

// Network-first for navigations (so updates show), cache-first for static assets,
// with a runtime cache fallback so the app works fully offline.
self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put('/', copy))
        return res
      }).catch(() => caches.match('/').then((r) => r || caches.match('/index.html'))),
    )
    return
  }

  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((res) => {
        if (res && res.status === 200 && new URL(request.url).origin === self.location.origin) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(request, copy))
        }
        return res
      }).catch(() => cached)
    }),
  )
})

// Tapping a reminder focuses (or opens) the app.
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus()
      if (self.clients.openWindow) return self.clients.openWindow('/')
    }),
  )
})
