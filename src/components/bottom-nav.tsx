"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Flag, Sprout, Globe, ShieldCheck, Inbox } from "lucide-react";
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
      pathname.startsWith("/companion") ||
      pathname.startsWith("/prayer-room") ||
      (pathname.startsWith("/ask-pd") && !pathname.startsWith("/ask-pd/inbox")),
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

// PD team members who aren't admins (role 'pastor') get the Ask PD inbox
// in the admin slot instead.
const INBOX_ITEM = {
  href: "/ask-pd/inbox",
  labelKey: "inbox",
  icon: Inbox,
  isActive: (pathname: string) => pathname.startsWith("/ask-pd/inbox"),
} as const;

export function BottomNav({
  teamRole,
  teamNotificationCount = 0,
  askPdUnreadCount = 0,
  dict,
}: {
  // "admin" → Admin tab; "pastor" → Ask PD inbox tab; null → neither.
  teamRole: "admin" | "pastor" | null;
  teamNotificationCount?: number;
  // Ask PD replies the user hasn't read yet, badged on Connect.
  askPdUnreadCount?: number;
  dict: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const teamItem =
    teamRole === "admin" ? ADMIN_ITEM : teamRole === "pastor" ? INBOX_ITEM : null;
  const items = teamItem ? [...BASE_ITEMS, teamItem] : BASE_ITEMS;
  const badgeFor = (href: string) =>
    href === teamItem?.href
      ? teamNotificationCount
      : href === "/connect"
        ? askPdUnreadCount
        : 0;

  // The book reader is full-screen with its own Back link; the nav would
  // sit on top of its page controls.
  if (/^\/evolve\/books\/[^/]+\/read/.test(pathname)) {
    return null;
  }

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
          teamItem ? "grid-cols-6" : "grid-cols-5",
        )}
      >
        {items.map(({ href, labelKey, icon: Icon, isActive: matches }) => {
          const active = matches(pathname);
          const badge = badgeFor(href);
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
              <span className="relative inline-flex">
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold leading-none text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </span>
              {dict[labelKey]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
