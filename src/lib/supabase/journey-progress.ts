import type { SupabaseClient } from "@supabase/supabase-js";
import { getJourneySession, type JourneySession } from "@/lib/content/journeys";

// The only journey in V1 (ticket 07) — there's nothing yet to pick between.
export const JOURNEY_SLUG = "faith-in-christ";

export type JourneyProgressRow = {
  current_session_number: number;
  completed_at: string | null;
};

export async function getCurrentJourneyState(
  supabase: SupabaseClient,
  userId: string,
): Promise<{
  progress: JourneyProgressRow | null;
  currentSession: JourneySession | null;
}> {
  const { data: progress, error } = await supabase
    .from("journey_progress")
    .select("current_session_number, completed_at")
    .eq("user_id", userId)
    .eq("journey_slug", JOURNEY_SLUG)
    .maybeSingle<JourneyProgressRow>();

  if (error) {
    // Degrade to "not started" rather than a hard error — but log it,
    // since that's misleading for a user who has actually made progress.
    console.error("Failed to load journey progress", error);
  }

  const currentSession =
    progress && !progress.completed_at
      ? getJourneySession(JOURNEY_SLUG, progress.current_session_number)
      : null;

  return { progress: progress ?? null, currentSession };
}
