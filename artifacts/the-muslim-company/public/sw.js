// "Killer" service worker.
// A previous version of this site registered a service worker that is still
// active in some visitors' browsers, causing them to see stale cached pages
// (most noticeably the home page "/", since it's the most-visited URL and
// therefore the most likely to have been cached by the old worker).
//
// This file replaces whatever the old service worker script contained. When
// a browser with the old worker does its routine background update check,
// it will fetch this file, see the content has changed, install this new
// version, and — on activation — wipe every cache this origin owns and
// unregister itself so all future requests go straight to the network.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({ type: "window" });
      clientsList.forEach((client) => client.navigate(client.url));
    })()
  );
});
