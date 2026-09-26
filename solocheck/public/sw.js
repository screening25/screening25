self.addEventListener('push', (e) => {
  const m = e.data ? e.data.json() : { title: '솔로체크' };
  e.waitUntil(self.registration.showNotification(m.title, {
    body: m.body, tag: m.tag, renotify: true, requireInteraction: true,
    vibrate: [500, 200, 500, 200, 500], data: { url: m.url ?? '/' },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});
