import type { SupabaseClient } from "@supabase/supabase-js";
import { findJourneySession } from "@/lib/content/journeys-repo";
import type { JourneySession } from "@/lib/content/journeys";

// The default journey shown to a brand-new user who has never started
// anything — preserves the original onboarding path. Once a user has real
// progress, the slug they're actually on (tracked per-row below) takes over.
export const JOURNEY_SLUG = "faith-in-christ";

export type JourneyProgressRow = {
  current_session_number: number;
  completed_at: string | null;
};

type JourneyProgressQueryRow = JourneyProgressRow & {
  journey_slug: string;
  started_at: string;
};

export async function getCurrentJourneyState(
  supabase: SupabaseClient,
  userId: string,
): Promise<{
  progress: JourneyProgressRow | null;
  currentSession: JourneySession | null;
  journeySlug: string;
}> {
  const { data: active, error: activeError } = await supabase
    .from("journey_progress")
    .select("journey_slug, current_session_number, completed_at, started_at")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle<JourneyProgressQueryRow>();

  if (activeError) {
    console.error("Failed to load active journey progress", activeError);
  }

  if (active) {
    return {
      progress: active,
      currentSession: await findJourneySession(
        supabase,
        active.journey_slug,
        active.current_session_number,
      ),
      journeySlug: active.journey_slug,
    };
  }

  const { data: completed, error: completedError } = await supabase
    .from("journey_progress")
    .select("journey_slug, current_session_number, completed_at, started_at")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle<JourneyProgressQueryRow>();

  if (completedError) {
    console.error("Failed to load completed journey progress", completedError);
  }

  if (completed) {
    return {
      progress: completed,
      currentSession: null,
      journeySlug: completed.journey_slug,
    };
  }

  return { progress: null, currentSession: null, journeySlug: JOURNEY_SLUG };
}
