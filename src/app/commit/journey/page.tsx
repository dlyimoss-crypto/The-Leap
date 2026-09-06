import { redirect } from "next/navigation";
import { Compass, Map } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentJourneyState } from "@/lib/supabase/journey-progress";
import { journeyContinueHref } from "@/lib/journey-nav";

export default async function JourneyChooserPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { progress, journeySlug } = await getCurrentJourneyState(
    supabase,
    user.id,
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <BackLink href="/commit" label="Commit" />

      <div>
        <h1 className="text-2xl font-heading font-semibold">Journey</h1>
        <p className="text-sm text-muted-foreground">
          A structured, multi-day path with Christ.
        </p>
      </div>

      <div className="space-y-3">
        <HubCard
          href={journeyContinueHref(journeySlug, progress)}
          icon={Compass}
          title="Continue Your Journey"
          description="Pick up where you left off."
        />
        <HubCard
          href="/commit/journeys"
          icon={Map}
          title="Browse Journeys"
          description="Explore other formation journeys you can start."
        />
      </div>
    </main>
  );
}
