import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

// An Announcement is the single featured window on Home: a prayer movement,
// a piece of news, an event, an advert or a general message. Stored in the
// `prayer_movements` table (it began life as prayer-only — see migration
// 0036), so a 'prayer' announcement is exactly what used to be called a
// prayer movement.
import type { AnnouncementKind } from "@/lib/announcement-kinds";

export {
  ANNOUNCEMENT_KINDS,
  ANNOUNCEMENT_KIND_LABELS,
  isAnnouncementKind,
  sanitizeAnnouncementLink,
  type AnnouncementKind,
} from "@/lib/announcement-kinds";

export type Announcement = {
  id: string;
  kind: AnnouncementKind;
  title: string;
  body: string | null;
  image_path: string | null;
  link_url: string | null;
  link_label: string | null;
  event_date: string | null;
  scripture_reference: string | null;
  prayer_points: string[];
  created_at: string;
  active_until: string | null;
};

export const ANNOUNCEMENT_COLUMNS =
  "id, kind, title, body, image_path, link_url, link_label, event_date, scripture_reference, prayer_points, created_at, active_until";

export const ANNOUNCEMENT_IMAGE_BUCKET = "announcement-images";

// The single featured announcement, if any — only one is "active" at a time
// so Home always has one clear thing to bring into awareness rather than a
// list. One with an `active_until` in the past is treated as expired and
// excluded here, even though its row is still `status = 'active'` — the
// admin has to re-activate it (with a fresh day count) to bring it back.
export async function getActiveAnnouncement(
  supabase: SupabaseClient,
): Promise<Announcement | null> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("prayer_movements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("status", "active")
    .or(`active_until.is.null,active_until.gte.${today}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Announcement>();

  if (error) {
    console.error("Failed to load active announcement", error);
  }

  return data ?? null;
}

// "active prayer movements are publicly readable" (migration 0023) — this
// is the exact same row for every visitor, so it doesn't need the caller's
// own session to read it. A plain anon client here (instead of the
// per-request cookie-bound one) lets unstable_cache actually reuse the
// result across requests/users instead of re-fetching on every Home or
// Prayer Room render. Admin's create/update/activate/archive/delete actions
// call revalidateTag("announcement") to invalidate this immediately; the
// 60s revalidate is just a safety net.
function publicAnnouncementsClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const getActiveAnnouncementCached = unstable_cache(
  async () => getActiveAnnouncement(publicAnnouncementsClient()),
  ["active-announcement"],
  { tags: ["announcement"], revalidate: 60 },
);

export function getAnnouncementImageUrl(imagePath: string | null): string | null {
  if (!imagePath) {
    return null;
  }
  return publicAnnouncementsClient()
    .storage.from(ANNOUNCEMENT_IMAGE_BUCKET)
    .getPublicUrl(imagePath).data.publicUrl;
}

// Where tapping the Home banner goes: a prayer announcement opens the
// Prayer Room (where people pray and mark "I have prayed"); everything
// else opens its own announcement page.
export function announcementHref(announcement: Announcement): string {
  return announcement.kind === "prayer"
    ? "/prayer-room"
    : `/announcements/${announcement.id}`;
}

export async function getPrayerMovementParticipation(
  supabase: SupabaseClient,
  movementId: string,
  userId: string,
): Promise<{ count: number; hasPrayed: boolean }> {
  const [{ count }, { data: mine }] = await Promise.all([
    supabase
      .from("prayer_movement_participants")
      .select("user_id", { count: "exact", head: true })
      .eq("movement_id", movementId),
    supabase
      .from("prayer_movement_participants")
      .select("user_id")
      .eq("movement_id", movementId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  return { count: count ?? 0, hasPrayed: !!mine };
}

// Whole days remaining until (and including) `active_until`, or null if the
// announcement has no expiry. Rounds up so "activated today, 1 day" reads
// as "1 day left" all day rather than immediately showing 0.
export function getAnnouncementDaysLeft(
  activeUntil: string | null,
): number | null {
  if (!activeUntil) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${activeUntil}T00:00:00`);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  return Math.max(diffDays + 1, 0);
}

// "Saturday, 14 November" — for an event's date on the banner and page.
export function formatEventDate(eventDate: string, locale = "en-GB"): string {
  return new Date(`${eventDate}T00:00:00`).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
