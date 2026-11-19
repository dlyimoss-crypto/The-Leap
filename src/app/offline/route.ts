import fs from "node:fs";
import path from "node:path";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO } from "@/lib/i18n/locales";

// The page the service worker shows when the reader opens something offline
// that isn't saved on the device. It has to work with no network at all, so
// it's one self-contained HTML document (inline CSS and script, no Next.js
// chunks), built once at build time with every language's strings. The
// script picks the language the reader last used (from the service worker's
// session record) and lists the pages saved on this device.
export const dynamic = "force-static";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHtml(): string {
  const strings = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      { ...getDictionary(locale).common.offline, dir: LOCALE_INFO[locale].dir },
    ]),
  );
  const rules = fs.readFileSync(path.join(process.cwd(), "public", "sw-rules.js"), "utf-8");
  const en = Object.fromEntries(
    Object.entries(strings[DEFAULT_LOCALE]).map(([k, v]) => [k, escapeHtml(v)]),
  );
  // JSON inside <script>: escape "<" so no string can close the tag.
  const json = JSON.stringify(strings).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0E0D0C">
<title>The Leap</title>
<style>
  :root { color-scheme: light dark; --bg:#faf8f5; --fg:#1c1a17; --muted:#6b655d; --card:#fff; --border:#e7e2da; --accent:#c2410c; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0e0d0c; --fg:#f3efe9; --muted:#a39d94; --card:#1a1816; --border:#2c2925; --accent:#fb923c; } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; background:var(--bg); color:var(--fg); font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif; }
  main { max-width:32rem; margin:0 auto; padding:4rem 1.25rem 2rem; }
  h1 { font-size:1.5rem; margin:0 0 .5rem; }
  h2 { font-size:.75rem; letter-spacing:.06em; text-transform:uppercase; color:var(--accent); margin:2rem 0 .75rem; }
  p { color:var(--muted); margin:0; }
  ul { list-style:none; padding:0; margin:0; display:grid; gap:.5rem; }
  a.item { display:block; padding:.85rem 1rem; border:1px solid var(--border); border-radius:1rem; background:var(--card); color:inherit; text-decoration:none; }
  a.item small { display:block; color:var(--muted); font-size:.75rem; }
  button { margin-top:1.5rem; font:inherit; padding:.6rem 1.2rem; border-radius:999px; border:0; background:var(--fg); color:var(--bg); cursor:pointer; }
</style>
</head>
<body>
<main>
  <h1 id="title">${en.title}</h1>
  <p id="body">${en.body}</p>
  <button id="retry" type="button">${en.retry}</button>
  <h2 id="saved-heading">${en.savedHeading}</h2>
  <p id="nothing" hidden>${en.nothingSaved}</p>
  <ul id="saved"></ul>
</main>
<script>${rules}</script>
<script>
(function () {
  var STRINGS = ${json};
  var R = self.LeapOfflineRules;
  function pick(locale) {
    if (locale && STRINGS[locale]) return locale;
    var langs = navigator.languages || [navigator.language];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]);
      if (STRINGS[l]) return l;
      if (l.toLowerCase().indexOf("zh") === 0 && STRINGS["zh-CN"]) return "zh-CN";
      var base = l.split("-")[0];
      if (STRINGS[base]) return base;
    }
    return "${DEFAULT_LOCALE}";
  }
  function apply(locale) {
    var t = STRINGS[locale];
    document.documentElement.lang = locale;
    document.documentElement.dir = t.dir;
    document.getElementById("title").textContent = t.title;
    document.getElementById("body").textContent = t.body;
    document.getElementById("retry").textContent = t.retry;
    document.getElementById("saved-heading").textContent = t.savedHeading;
    document.getElementById("nothing").textContent = t.nothingSaved;
  }
  function titleOf(html, fallback) {
    try {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var h1 = doc.querySelector("main h1") || doc.querySelector("h1");
      var text = h1 && h1.textContent.trim();
      return text || fallback;
    } catch (e) { return fallback; }
  }
  document.getElementById("retry").addEventListener("click", function () { location.reload(); });

  if (!("caches" in self)) { document.getElementById("nothing").hidden = false; return; }

  caches.open(R.META_CACHE)
    .then(function (c) { return c.match(R.SESSION_KEY); })
    .then(function (res) { return res ? res.json() : null; })
    .catch(function () { return null; })
    .then(function (session) {
      apply(pick(session && session.locale));
      return caches.open(R.READING_CACHE);
    })
    .then(function (cache) {
      return cache.keys().then(function (keys) {
        // Newest first; the offline page itself is never in this cache.
        keys = keys.slice().reverse();
        return Promise.all(keys.map(function (req) {
          return cache.match(req).then(function (res) { return res.text(); }).then(function (html) {
            var url = new URL(req.url);
            return { href: url.pathname + url.search, title: titleOf(html, url.pathname) };
          });
        }));
      });
    })
    .then(function (items) {
      var list = document.getElementById("saved");
      if (!items.length) { document.getElementById("nothing").hidden = false; return; }
      items.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.className = "item";
        a.href = item.href;
        a.textContent = item.title;
        if (item.title !== item.href) {
          var small = document.createElement("small");
          small.textContent = item.href;
          a.appendChild(small);
        }
        li.appendChild(a);
        list.appendChild(li);
      });
    })
    .catch(function () { document.getElementById("nothing").hidden = false; });
})();
</script>
</body>
</html>`;
}

export function GET() {
  return new Response(buildHtml(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
