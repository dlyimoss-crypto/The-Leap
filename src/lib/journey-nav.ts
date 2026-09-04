import type { JourneyProgressRow } from "@/lib/supabase/journey-progress";

// Not-started / in-progress / completed href logic, shared by Home's
// continue-journey card and the Evolve hub's "Continue Your Journey" card.
export function journeyContinueHref(
  slug: string,
  progress: JourneyProgressRow | null,
): string {
  if (!progress) {
    return `/journeys/${slug}`;
  }
  if (progress.completed_at) {
    return `/journeys/${slug}/day/1`;
  }
  return `/journeys/${slug}/day/${progress.current_session_number}`;
}
