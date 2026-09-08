"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { COMPANION_INTENTS } from "@/lib/companion-intents";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Companion is cross-cutting (ticket 10), not a nav tab — only float it on
// the surfaces the ticket names, and never on /companion itself.
const FLOAT_ALLOWLIST = [
  /^\/$/,
  /^\/prayer-room/,
  /^\/community/,
  /^\/evolve\/scripture/,
  /^\/journeys\/[^/]+\/day\/[^/]+$/,
];

export function CompanionLauncher({
  dict,
}: {
  dict: Dictionary["companion"];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const shouldRender =
    pathname !== "/companion" &&
    FLOAT_ALLOWLIST.some((pattern) => pattern.test(pathname));

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[45] bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {open && (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md space-y-1 rounded-2xl border bg-card p-3 shadow-lg">
          <div className="flex items-center justify-between px-1 pb-1">
            <p className="text-sm font-semibold">{dict.menuHeading}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.close}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          {COMPANION_INTENTS.map(({ slug, label, icon: Icon }) => (
            <Link
              key={slug}
              href={`/companion?intent=${slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-muted"
            >
              <Icon className="size-4 text-primary" />
              {dict.intents[slug] ?? label}
            </Link>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={dict.openAriaLabel}
        className="fixed right-4 bottom-20 z-40 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        <Sparkles className="size-4" />
        {dict.button}
      </button>
    </>
  );
}
