import { createClient } from "@/lib/supabase/server";
import { getJourneyMeta, getJourneySession } from "@/lib/content/journeys";
import { WelcomeView } from "./welcome-view";
import { DashboardView } from "./dashboard-view";

// The only journey in V1 (ticket 07) — there's nothing yet to pick between.
const JOURNEY_SLUG = "faith-in-christ";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <WelcomeView />;
  }

  const journey = getJourneyMeta(JOURNEY_SLUG);
  if (!journey) {
    return <WelcomeView />;
  }

  const { data: progress, error: progressError } = await supabase
    .from("journey_progress")
    .select("current_session_number, completed_at")
    .eq("user_id", user.id)
    .eq("journey_slug", JOURNEY_SLUG)
    .maybeSingle();

  if (progressError) {
    // Degrade to the "not started" view rather than a hard error page —
    // but log it, since that view is misleading for a user who has
    // actually made progress.
    console.error("Failed to load journey progress", progressError);
  }

  const nextSessionTitle =
    progress && !progress.completed_at
      ? (getJourneySession(JOURNEY_SLUG, progress.current_session_number)
          ?.title ?? null)
      : null;

  return (
    <DashboardView
      journey={journey}
      progress={progress}
      nextSessionTitle={nextSessionTitle}
    />
  );
}
