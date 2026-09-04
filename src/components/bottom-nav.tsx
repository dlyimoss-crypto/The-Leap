"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  HeartHandshake,
  Users,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/prayer-room", label: "Prayer", icon: HeartHandshake },
  { href: "/community", label: "Community", icon: Users },
  { href: "/companion", label: "Companion", icon: MessageCircle },
] as const;

const ADMIN_ITEM = { href: "/admin", label: "Admin", icon: ShieldCheck };

export function BottomNav({ isAdmin }: { isAdmin: boolean }) {
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
          isAdmin ? "grid-cols-5" : "grid-cols-4",
        )}
      >
        {items.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
