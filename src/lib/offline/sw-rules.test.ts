import { createRequire } from "node:module";
import { describe, expect, test } from "vitest";

// The service worker's rules are a plain script in public/ (no build step);
// it exports via module.exports when loaded outside a worker.
const require = createRequire(import.meta.url);
const R = require("../../../public/sw-rules.js") as {
  isReadingPath(pathname: string): boolean;
  isStaticAsset(pathname: string): boolean;
  cacheKey(href: string): string;
  shouldDiscard(
    saved: { userId: string | null; locale: string | null } | null,
    current: { userId: string | null; locale: string | null },
  ): boolean;
  shouldSave(session: { userId: string | null } | null, response: Response): boolean;
};

function htmlResponse(init: Partial<Response> & { contentType?: string } = {}) {
  return {
    ok: init.ok ?? true,
    redirected: init.redirected ?? false,
    type: init.type ?? "basic",
    headers: new Headers({ "content-type": init.contentType ?? "text/html; charset=utf-8" }),
  } as Response;
}

describe("isReadingPath", () => {
  test.each([
    "/",
    "/evolve/devotion",
    "/evolve/scripture",
    "/journeys/new-life",
    "/journeys/new-life/day/3",
    "/announcements/abc-123",
  ])("saves %s for offline reading", (path) => {
    expect(R.isReadingPath(path)).toBe(true);
  });

  test.each([
    "/profile",
    "/admin",
    "/admin/translations",
    "/community",
    "/sign-in",
    "/offline",
    "/journeys/new-life/day/three",
    "/journeys/new-life/day/3/extra",
    "/api/cron/devotion-reminders",
  ])("never saves %s", (path) => {
    expect(R.isReadingPath(path)).toBe(false);
  });
});

describe("isStaticAsset", () => {
  test("build output and app icons are cache-first", () => {
    expect(R.isStaticAsset("/_next/static/chunks/app.js")).toBe(true);
    expect(R.isStaticAsset("/_next/static/media/sora.woff2")).toBe(true);
    expect(R.isStaticAsset("/icon-192.png")).toBe(true);
  });

  test("pages, data and images from storage are not", () => {
    expect(R.isStaticAsset("/")).toBe(false);
    expect(R.isStaticAsset("/_next/image")).toBe(false);
    expect(R.isStaticAsset("/sw.js")).toBe(false);
  });
});

describe("cacheKey", () => {
  test("keeps the query (devotion ?id=) and drops the hash", () => {
    expect(R.cacheKey("https://leapgrow.app/evolve/devotion?id=7#prayer")).toBe(
      "https://leapgrow.app/evolve/devotion?id=7",
    );
  });
});

describe("shouldDiscard", () => {
  const saved = { userId: "u1", locale: "de" };

  test("keeps saved pages for the same reader and language", () => {
    expect(R.shouldDiscard(saved, { userId: "u1", locale: "de" })).toBe(false);
  });

  test("discards them on sign-out, another account or another language", () => {
    expect(R.shouldDiscard(saved, { userId: null, locale: "de" })).toBe(true);
    expect(R.shouldDiscard(saved, { userId: "u2", locale: "de" })).toBe(true);
    expect(R.shouldDiscard(saved, { userId: "u1", locale: "fr" })).toBe(true);
  });

  test("nothing to discard before the first session is recorded", () => {
    expect(R.shouldDiscard(null, { userId: "u1", locale: "en" })).toBe(false);
  });
});

describe("shouldSave", () => {
  const session = { userId: "u1" };

  test("saves an ordinary page for a signed-in reader", () => {
    expect(R.shouldSave(session, htmlResponse())).toBe(true);
  });

  test("saves nothing while signed out", () => {
    expect(R.shouldSave(null, htmlResponse())).toBe(false);
    expect(R.shouldSave({ userId: null }, htmlResponse())).toBe(false);
  });

  test("never saves redirects (e.g. to sign-in), errors or non-HTML", () => {
    expect(R.shouldSave(session, htmlResponse({ redirected: true }))).toBe(false);
    expect(R.shouldSave(session, htmlResponse({ ok: false }))).toBe(false);
    expect(R.shouldSave(session, htmlResponse({ type: "opaque" }))).toBe(false);
    expect(R.shouldSave(session, htmlResponse({ contentType: "application/json" }))).toBe(false);
  });
});
