import type { SupabaseClient } from "@supabase/supabase-js";

export type PrayerMovement = {
  id: string;
  title: string;
  scripture_reference: string | null;
  prayer_points: string[];
  created_at: string;
};

// The single featured prayer movement, if any — mirrors the "at most one
// active commitment" pattern so the Prayer Room always has one clear cause
// to rally around rather than a list to choose from.
export async function getActivePrayerMovement(
  supabase: SupabaseClient,
): Promise<PrayerMovement | null> {
  const { data, error } = await supabase
    .from("prayer_movements")
    .select("id, title, scripture_reference, prayer_points, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<PrayerMovement>();

  if (error) {
    console.error("Failed to load active prayer movement", error);
  }

  return data ?? null;
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
