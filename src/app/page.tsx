import { getAuthedUser } from "@/lib/supabase/authorize";
import {
  findAvailableJourneysCached,
  findJourneyMetaCached,
} from "@/lib/content/journeys-repo";
import { getCurrentJourneyState } from "@/lib/supabase/journey-progress";
import {
  commitmentItemsDone,
  COMMITMENT_ITEMS,
  getActiveCommitment,
} from "@/lib/supabase/commitments";
import { getActivePrayerMovementCached } from "@/lib/supabase/prayer-movements";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WelcomeView } from "./welcome-view";
import { DashboardView } from "./dashboard-view";

export default async function HomePage(props: PageProps<"/">) {
  const { supabase, user } = await getAuthedUser();

  if (!user) {
    return <WelcomeView />;
  }

  // Sign-in/sign-up redirect here with ?gospel_invite=1 so the card shows
  // once per sign-in event, not on every Home render — see sign-in/actions.ts.
  const searchParams = await props.searchParams;
  const gospelInviteParam = Array.isArray(searchParams.gospel_invite)
    ? searchParams.gospel_invite[0]
    : searchParams.gospel_invite;
  const showGospelInvite = gospelInviteParam === "1";

  // findJourneyMeta only depends on journeySlug (from getCurrentJourneyState),
  // not on the profile/commitment/prayerMovement queries below it — chaining
  // it off that one promise, then awaiting everything together, lets it run
  // concurrently with those instead of waiting for all of them to finish
  // first. Every serial round trip here is a few hundred ms on top of the
  // two Supabase Auth calls (middleware + getAuthedUser) already paid above.
  const journeyState = getCurrentJourneyState(supabase, user.id);
  const journeyMeta = journeyState.then(({ journeySlug }) =>
    findJourneyMetaCached(journeySlug),
  );

  const [
    { progress, journeySlug },
    { data: profile },
    commitment,
    prayerMovement,
    journey,
  ] = await Promise.all([
      journeyState,
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single(),
      getActiveCommitment(supabase, user.id),
      getActivePrayerMovementCached(),
      journeyMeta,
    ]);

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
    const available = await findAvailableJourneysCached();
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
      showGospelInvite={showGospelInvite}
    />
  );
}
