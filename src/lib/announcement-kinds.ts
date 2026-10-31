// Plain constants and helpers for Announcements, free of server-only
// imports so the admin form (a client component) can share them.

export const ANNOUNCEMENT_KINDS = [
  "prayer",
  "news",
  "event",
  "advert",
  "general",
] as const;

export type AnnouncementKind = (typeof ANNOUNCEMENT_KINDS)[number];

export const ANNOUNCEMENT_KIND_LABELS: Record<AnnouncementKind, string> = {
  prayer: "Prayer",
  news: "News",
  event: "Event",
  advert: "Advert",
  general: "General",
};

export function isAnnouncementKind(value: unknown): value is AnnouncementKind {
  return (
    typeof value === "string" &&
    (ANNOUNCEMENT_KINDS as readonly string[]).includes(value)
  );
}

// Only https:// links and in-app paths ("/evolve/books") are allowed, so an
// announcement can never carry a javascript: or other scheme into an href.
export function sanitizeAnnouncementLink(raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    return null;
  }
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
