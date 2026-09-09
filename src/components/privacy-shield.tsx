"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "./brand-mark";

// There is no web API that can block or detect an OS screenshot — that's
// only possible for natively-compiled apps (e.g. Android's FLAG_SECURE).
// What we *can* do: cover the screen the instant the app is backgrounded,
// so personal content (prayer requests, reflections, messages) isn't
// visible in the iOS/Android app-switcher preview to someone glancing at
// the phone. document.visibilitychange fires synchronously enough to beat
// that preview snapshot in practice; window blur/focus is intentionally
// not used as a trigger since it also fires for in-page focus changes
// (opening a native <select>, a file picker) that aren't really
// "backgrounded."
export function PrivacyShield() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function handleVisibilityChange() {
      setHidden(document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (!hidden) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1c1a18]">
      <BrandMark className="h-16 w-16" />
    </div>
  );
}
