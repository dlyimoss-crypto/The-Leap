import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Whether today's devotion (the newest one published by today) exists and
 * the user hasn't opened it yet. devotion_reads is owner-only under RLS,
 * so the embedded rows are just this user's — one round trip.
 */
export async function isTodaysDevotionUnread(
  supabase: SupabaseClient,
): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("devotions")
    .select("id, devotion_reads(user_id)")
    .lte("publish_date", today)
    .order("publish_date", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string; devotion_reads: { user_id: string }[] }>();

  if (error) {
    console.error("Failed to check today's devotion read", error);
    return false;
  }
  return !!data && data.devotion_reads.length === 0;
}
