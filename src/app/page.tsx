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

  const [{ progress, currentSession }, { data: profile }] = await Promise.all([
    getCurrentJourneyState(supabase, user.id),
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single(),
  ]);

  return (
    <DashboardView
      journey={journey}
      progress={progress}
      scriptureReference={currentSession?.scriptureReference ?? null}
      displayName={profile?.display_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
    />
  );
}
