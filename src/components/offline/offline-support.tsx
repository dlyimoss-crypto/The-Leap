"use client";

import { useEffect, useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

/**
 * Turns on offline reading (see public/sw.js) and shows a banner while the
 * device has no connection.
 *
 * It also tells the service worker who is signed in and in which language,
 * every time either changes. The worker keeps saved pages only for that
 * reader and language, and discards them on sign-out, an account switch or
 * a language change.
 */
export function OfflineSupport({
  userId,
  locale,
  bannerText,
}: {
  userId: string | null;
  locale: string;
  bannerText: string;
}) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (cancelled) return;
        registration.active?.postMessage({ type: "leap-session", userId, locale });
      })
      .catch((err) => console.error("Offline reading unavailable", err));
    return () => {
      cancelled = true;
    };
  }, [userId, locale]);

  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-foreground py-2 ps-4 pe-14 text-center text-xs text-background"
    >
      <WifiOff aria-hidden className="size-3.5 shrink-0" />
      <span>{bannerText}</span>
    </div>
  );
}

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}
