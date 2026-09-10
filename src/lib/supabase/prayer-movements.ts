import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

export type PrayerMovement = {
  id: string;
  title: string;
  scripture_reference: string | null;
  prayer_points: string[];
  created_at: string;
  active_until: string | null;
};

// The single featured prayer movement, if any — mirrors the "at most one
// active commitment" pattern so the Prayer Room always has one clear cause
// to rally around rather than a list to choose from. A movement with an
// `active_until` in the past is treated as expired and excluded here, even
// though its row is still `status = 'active'` — the admin has to
// re-activate it (with a fresh day count) to bring it back.
export async function getActivePrayerMovement(
  supabase: SupabaseClient,
): Promise<PrayerMovement | null> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("prayer_movements")
    .select("id, title, scripture_reference, prayer_points, created_at, active_until")
    .eq("status", "active")
    .or(`active_until.is.null,active_until.gte.${today}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<PrayerMovement>();

  if (error) {
    console.error("Failed to load active prayer movement", error);
  }

  return data ?? null;
}

// "active prayer movements are publicly readable" (migration 0023) — this
// is the exact same row for every visitor, so it doesn't need the caller's
// own session to read it. A plain anon client here (instead of the
// per-request cookie-bound one) lets unstable_cache actually reuse the
// result across requests/users instead of re-fetching on every Home or
// Prayer Room render. Admin's create/update/activate/archive/delete actions
// call revalidateTag("prayer-movement") to invalidate this immediately;
// the 60s revalidate is just a safety net.
function publicPrayerMovementsClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const getActivePrayerMovementCached = unstable_cache(
  async () => getActivePrayerMovement(publicPrayerMovementsClient()),
  ["active-prayer-movement"],
  { tags: ["prayer-movement"], revalidate: 60 },
);

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
// movement has no expiry. Rounds up so "activated today, 1 day" reads as
// "1 day left" all day rather than immediately showing 0.
export function getPrayerMovementDaysLeft(
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
