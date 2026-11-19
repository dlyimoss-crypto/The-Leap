// The Leap service worker:
// - daily devotion push notifications
// - offline reading: pages the reader opened while online (devotions,
//   journeys, Scripture, announcements, Home) stay readable offline, for the
//   signed-in reader and language they were opened in. Rules: sw-rules.js.

importScripts("/sw-rules.js");
var R = self.LeapOfflineRules;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(R.STATIC_CACHE)
      .then((cache) => cache.add(R.OFFLINE_URL))
      // Never let a failed precache block push notifications from working.
      .catch((err) => console.warn("Offline page not cached", err))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const current = [R.READING_CACHE, R.STATIC_CACHE, R.META_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("leap-") && !current.includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ---- Session: who is signed in, in which language -------------------------

async function readSession() {
  const cache = await caches.open(R.META_CACHE);
  const res = await cache.match(R.SESSION_KEY);
  return res ? res.json() : null;
}

async function writeSession(session) {
  const cache = await caches.open(R.META_CACHE);
  await cache.put(
    R.SESSION_KEY,
    new Response(JSON.stringify(session), {
      headers: { "content-type": "application/json" },
    }),
  );
}

async function updateSession(current) {
  const saved = await readSession();
  if (R.shouldDiscard(saved, current) || !current.userId) {
    await caches.delete(R.READING_CACHE);
  }
  await writeSession(current);
}

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "leap-session") {
    event.waitUntil(
      updateSession({
        userId: typeof data.userId === "string" ? data.userId : null,
        locale: typeof data.locale === "string" ? data.locale : null,
      }),
    );
  }
});

// ---- Fetch -----------------------------------------------------------------

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  // Cache keys come back in insertion order: drop the oldest.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((k) => cache.delete(k)));
}

async function saveReading(key, response) {
  const session = await readSession();
  if (!R.shouldSave(session, response)) return;
  const cache = await caches.open(R.READING_CACHE);
  await cache.delete(key); // re-insert so it counts as most recent
  await cache.put(key, response);
  await trim(R.READING_CACHE, R.MAX_READING_ENTRIES);
}

async function offlineFallback() {
  const offline = await caches.match(R.OFFLINE_URL, { cacheName: R.STATIC_CACHE });
  return offline || Response.error();
}

async function handleNavigation(event, isReading) {
  const key = R.cacheKey(event.request.url);
  const network = fetch(event.request);

  if (isReading) {
    // Whatever happens below, a fresh copy replaces the saved one.
    event.waitUntil(
      network.then((res) => saveReading(key, res.clone())).catch(() => {}),
    );
  }

  const saved = isReading
    ? await caches.match(key, { cacheName: R.READING_CACHE })
    : undefined;

  try {
    if (!saved) return await network;
    let timer;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(() => resolve(null), R.NETWORK_TIMEOUT_MS);
    });
    const res = await Promise.race([network, timeout]);
    clearTimeout(timer);
    return res || saved;
  } catch {
    return saved || offlineFallback();
  }
}

async function handleStatic(request) {
  const cache = await caches.open(R.STATIC_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === "basic") {
    await cache.put(request, res.clone());
    trim(R.STATIC_CACHE, R.MAX_STATIC_ENTRIES);
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event, R.isReadingPath(url.pathname)));
  } else if (R.isStaticAsset(url.pathname)) {
    event.respondWith(handleStatic(request));
  }
});

// ---- Push notifications ----------------------------------------------------

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "The Leap", {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "daily-devotion",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data.url, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        const open = windows.find((w) => w.url.startsWith(self.location.origin));
        if (open) {
          return open.navigate(url).then((w) => (w || open).focus());
        }
        return self.clients.openWindow(url);
      }),
  );
});
