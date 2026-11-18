"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const emptySubscribe = () => () => {};

// Guaranteed to be false on the server and on the client's first (hydrating)
// render, then true from then on — the React-documented way to render
// something different post-hydration without a mismatch warning.
function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({
  dict,
}: {
  dict: Dictionary["common"]["themeToggle"];
}) {
  const isHydrated = useIsHydrated();
  const { resolvedTheme, setTheme } = useTheme();

  if (!isHydrated) {
    return <div className="size-8" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? dict.toLight : dict.toDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
