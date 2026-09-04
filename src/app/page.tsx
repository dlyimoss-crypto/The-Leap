import { createClient } from "@/lib/supabase/server";
import { getJourneyMeta } from "@/lib/content/journeys";
import {
  getCurrentJourneyState,
  JOURNEY_SLUG,
} from "@/lib/supabase/journey-progress";
import { WelcomeView } from "./welcome-view";
import { DashboardView } from "./dashboard-view";

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

  const { progress, currentSession } = await getCurrentJourneyState(
    supabase,
    user.id,
  );

  return (
    <DashboardView
      journey={journey}
      progress={progress}
      nextSessionTitle={currentSession?.title ?? null}
    />
  );
}
