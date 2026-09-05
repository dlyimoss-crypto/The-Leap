import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step } from "@/components/step";
import { createClient } from "@/lib/supabase/server";
import { getJourneyMeta } from "@/lib/content/journeys";
import {
  getCurrentJourneyState,
  JOURNEY_SLUG,
} from "@/lib/supabase/journey-progress";

export default async function DevotionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { progress, currentSession } = await getCurrentJourneyState(
    supabase,
    user.id,
  );
  const journey = getJourneyMeta(JOURNEY_SLUG);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Daily Devotion
        </h1>
        <p className="text-sm text-muted-foreground">
          Pause, reflect and encounter God in today&apos;s thought.
        </p>
      </div>

      {currentSession && journey ? (
        <div className="space-y-5 rounded-xl border bg-card p-5">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Day {currentSession.day} of {journey.durationDays}
            </p>
            <h2 className="text-xl font-heading font-semibold text-balance">
              {currentSession.title}
            </h2>
          </div>
          <Step label="Explore">{currentSession.explore}</Step>
          <Step label="Reflect">{currentSession.reflect}</Step>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
          <Sparkles className="size-8 text-muted-foreground/50" />
          {progress?.completed_at ? (
            <>
              <p className="text-sm text-muted-foreground">
                You&apos;ve completed your current journey — a new devotion
                will be ready when your next journey begins.
              </p>
              <Button
                render={<Link href={`/journeys/${JOURNEY_SLUG}/day/1`} />}
                nativeButton={false}
                variant="outline"
              >
                Review the journey
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Begin your journey to unlock today&apos;s devotion.
              </p>
              <Button
                render={<Link href={`/journeys/${JOURNEY_SLUG}`} />}
                nativeButton={false}
              >
                Begin my journey
              </Button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
