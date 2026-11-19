// Offline-reading rules for the service worker (loaded by sw.js with
// importScripts, and by the unit tests with require). Plain script, no
// build step: keep it ES2017 and dependency-free.
(function (root) {
  // Pages kept for offline reading once the reader has opened them while
  // online. Everything else always goes to the network.
  var READING_PATHS = [
    /^\/$/,
    /^\/evolve\/devotion$/,
    /^\/evolve\/scripture$/,
    /^\/journeys\/[^/]+$/,
    /^\/journeys\/[^/]+\/day\/\d+$/,
    /^\/announcements\/[^/]+$/,
  ];

  var rules = {
    // Bump to throw away every saved page and asset on the next visit.
    VERSION: "v1",
    READING_CACHE: "leap-reading-v1",
    STATIC_CACHE: "leap-static-v1",
    META_CACHE: "leap-meta-v1",
    SESSION_KEY: "/__leap/session",
    OFFLINE_URL: "/offline",
    MAX_READING_ENTRIES: 50,
    MAX_STATIC_ENTRIES: 250,
    // On a slow connection, show the saved copy after this long rather than
    // a blank screen (the fresh page still replaces it in the cache).
    NETWORK_TIMEOUT_MS: 6000,

    isReadingPath: function (pathname) {
      return READING_PATHS.some(function (re) {
        return re.test(pathname);
      });
    },

    // Content-hashed build output and app icons never change under the same
    // URL, so they're safe to serve from the cache first.
    isStaticAsset: function (pathname) {
      return (
        pathname.indexOf("/_next/static/") === 0 ||
        /^\/(icon-\d+\.png|icon\.svg|apple-icon|favicon\.ico)/.test(pathname)
      );
    },

    // The key a reading page is stored under: same path and query, no hash.
    cacheKey: function (href) {
      var url = new URL(href);
      url.hash = "";
      return url.href;
    },

    // Saved pages belong to one signed-in person in one language. Any change
    // (signing out, another account, switching language) discards them, so a
    // shared phone never shows the previous reader's pages.
    shouldDiscard: function (saved, current) {
      if (!saved) return false;
      return saved.userId !== current.userId || saved.locale !== current.locale;
    },

    // Only save pages while someone is signed in, and only real pages: not a
    // redirect to sign-in, not an error, not another origin.
    shouldSave: function (session, response) {
      if (!session || !session.userId) return false;
      if (!response || !response.ok || response.redirected) return false;
      if (response.type !== "basic") return false;
      var type = response.headers.get("content-type") || "";
      return type.indexOf("text/html") === 0;
    },
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = rules;
  } else {
    root.LeapOfflineRules = rules;
  }
})(typeof self !== "undefined" ? self : this);
