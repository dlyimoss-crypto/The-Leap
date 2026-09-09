import { getAuthedUser } from "@/lib/supabase/authorize";
import { findAvailableJourneys, findJourneyMeta } from "@/lib/content/journeys-repo";
import { getCurrentJourneyState } from "@/lib/supabase/journey-progress";
import {
  commitmentItemsDone,
  COMMITMENT_ITEMS,
  getActiveCommitment,
} from "@/lib/supabase/commitments";
import { getActivePrayerMovement } from "@/lib/supabase/prayer-movements";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WelcomeView } from "./welcome-view";
import { DashboardView } from "./dashboard-view";

export default async function HomePage() {
  const { supabase, user } = await getAuthedUser();

  if (!user) {
    return <WelcomeView />;
  }

  const [
    { progress, journeySlug },
    { data: profile },
    commitment,
    prayerMovement,
  ] = await Promise.all([
    getCurrentJourneyState(supabase, user.id),
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single(),
    getActiveCommitment(supabase, user.id),
    getActivePrayerMovement(supabase),
  ]);

  const journey = await findJourneyMeta(supabase, journeySlug);
  if (!journey) {
    return <WelcomeView />;
  }

  const dict = getDictionary(await getLocale());

  // Only needed to power the completed-state "recommended next journey" card
  // — skip the extra query on every other Home render.
  let nextJourney: {
    slug: string;
    title: string;
    purpose: string;
    teaser?: string | null;
  } | null = null;
  if (progress?.completed_at) {
    const available = await findAvailableJourneys(supabase);
    const match = available.find((j) => j.slug !== journeySlug) ?? null;
    nextJourney = match
      ? {
          slug: match.slug,
          title: match.title,
          purpose: match.purpose,
          teaser: match.teaser,
        }
      : null;
  }

  return (
    <DashboardView
      journey={journey}
      progress={progress}
      dict={dict}
      displayName={profile?.display_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      nextJourney={nextJourney}
      commitmentProgress={
        commitment
          ? { done: commitmentItemsDone(commitment), total: COMMITMENT_ITEMS.length }
          : null
      }
      prayerMovement={prayerMovement}
      showGospelInvite
    />
  );
}
