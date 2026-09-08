import { getAuthedUser } from "@/lib/supabase/authorize";
import { findAvailableJourneys, findJourneyMeta } from "@/lib/content/journeys-repo";
import { getCurrentJourneyState } from "@/lib/supabase/journey-progress";
import {
  commitmentItemsDone,
  COMMITMENT_ITEMS,
  getActiveCommitment,
} from "@/lib/supabase/commitments";
import { getActivePrayerMovement } from "@/lib/supabase/prayer-movements";
import { WelcomeView } from "./welcome-view";
import { DashboardView } from "./dashboard-view";

export default async function HomePage() {
  const { supabase, user } = await getAuthedUser();

  if (!user) {
    return <WelcomeView />;
  }

  const [
    { progress, currentSession, journeySlug },
    { data: profile },
    commitment,
    prayerMovement,
  ] = await Promise.all([
    getCurrentJourneyState(supabase, user.id),
    supabase
      .from("profiles")
      .select("display_name, avatar_url, gospel_invite_shown_at")
      .eq("id", user.id)
      .single(),
    getActiveCommitment(supabase, user.id),
    getActivePrayerMovement(supabase),
  ]);

  const journey = await findJourneyMeta(supabase, journeySlug);
  if (!journey) {
    return <WelcomeView />;
  }

  // Only needed to power the completed-state "recommended next journey" card
  // — skip the extra query on every other Home render.
  let nextJourney: { slug: string; title: string; purpose: string } | null =
    null;
  if (progress?.completed_at) {
    const available = await findAvailableJourneys(supabase);
    const match = available.find((j) => j.slug !== journeySlug) ?? null;
    nextJourney = match
      ? { slug: match.slug, title: match.title, purpose: match.purpose }
      : null;
  }

  return (
    <DashboardView
      journey={journey}
      progress={progress}
      scriptureReference={currentSession?.scriptureReference ?? null}
      displayName={profile?.display_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      nextJourney={nextJourney}
      commitmentProgress={
        commitment
          ? { done: commitmentItemsDone(commitment), total: COMMITMENT_ITEMS.length }
          : null
      }
      prayerMovement={prayerMovement}
      showGospelInvite={!profile?.gospel_invite_shown_at}
    />
  );
}
