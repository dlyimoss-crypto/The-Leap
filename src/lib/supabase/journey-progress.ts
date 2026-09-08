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

/**
 * One session a day: pacing the formation loop matters more than speed, so a
 * day only unlocks once the previous one's completion has fallen off
 * "today" — otherwise a reader could clear all seven days in one sitting
 * with no room to actually pray or reflect between them.
 */
export async function isDayGatedUntilTomorrow(
  supabase: SupabaseClient,
  userId: string,
  journeySlug: string,
  dayNumber: number,
): Promise<boolean> {
  if (dayNumber <= 1) {
    return false;
  }

  const { data: completions } = await supabase
    .from("session_completions")
    .select("session_number, completed_at")
    .eq("user_id", userId)
    .eq("journey_slug", journeySlug)
    .in("session_number", [dayNumber - 1, dayNumber])
    .returns<{ session_number: number; completed_at: string }[]>();

  const previousCompletedAt = completions?.find(
    (c) => c.session_number === dayNumber - 1,
  )?.completed_at;
  const thisAlreadyDone = completions?.some(
    (c) => c.session_number === dayNumber,
  );

  if (!previousCompletedAt || thisAlreadyDone) {
    return false;
  }

  const today = new Date().toISOString().slice(0, 10);
  return previousCompletedAt.slice(0, 10) === today;
}
