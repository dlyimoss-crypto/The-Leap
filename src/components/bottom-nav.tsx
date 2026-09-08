"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Flag, Sprout, Globe, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Four Core Movements nav (ticket 10) — Connect/Evolve's real sub-destinations
// live outside their own hub's URL prefix (e.g. /community, /journeys), so
// each item gets its own active-match predicate instead of a flat prefix.
const BASE_ITEMS = [
  {
    href: "/",
    labelKey: "home",
    icon: Home,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    href: "/connect",
    labelKey: "connect",
    icon: Users,
    isActive: (pathname: string) =>
      pathname.startsWith("/connect") ||
      pathname.startsWith("/community") ||
      pathname.startsWith("/prayer-room"),
  },
  {
    href: "/commit",
    labelKey: "commit",
    icon: Flag,
    isActive: (pathname: string) =>
      pathname.startsWith("/commit") || pathname.startsWith("/journeys"),
  },
  {
    href: "/evolve",
    labelKey: "evolve",
    icon: Sprout,
    isActive: (pathname: string) => pathname.startsWith("/evolve"),
  },
  {
    href: "/engage",
    labelKey: "engage",
    icon: Globe,
    isActive: (pathname: string) => pathname.startsWith("/engage"),
  },
] as const;

const ADMIN_ITEM = {
  href: "/admin",
  labelKey: "admin",
  icon: ShieldCheck,
  isActive: (pathname: string) => pathname.startsWith("/admin"),
} as const;

export function BottomNav({
  isAdmin,
  dict,
}: {
  isAdmin: boolean;
  dict: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const items = isAdmin ? [...BASE_ITEMS, ADMIN_ITEM] : BASE_ITEMS;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur",
        "supports-[backdrop-filter]:bg-card/80",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-md",
          isAdmin ? "grid-cols-6" : "grid-cols-5",
        )}
      >
        {items.map(({ href, labelKey, icon: Icon, isActive: matches }) => {
          const active = matches(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
              {dict[labelKey]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
