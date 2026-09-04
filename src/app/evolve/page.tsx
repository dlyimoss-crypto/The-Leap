import { redirect } from "next/navigation";
import { Compass, BookOpen, Sparkles, Library } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { createClient } from "@/lib/supabase/server";
import {
  getCurrentJourneyState,
  JOURNEY_SLUG,
} from "@/lib/supabase/journey-progress";
import { journeyContinueHref } from "@/lib/journey-nav";

export default async function EvolvePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { progress } = await getCurrentJourneyState(supabase, user.id);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Evolve</h1>
        <p className="text-sm text-muted-foreground">I am becoming.</p>
      </div>

      <div className="space-y-3">
        <HubCard
          href={journeyContinueHref(JOURNEY_SLUG, progress)}
          icon={Compass}
          title="Continue Your Journey"
          description="Pick up where you left off."
        />
        <HubCard
          href="/evolve/scripture"
          icon={BookOpen}
          title="Scripture"
          description="Read, search, study and save God's Word."
        />
        <HubCard
          href="/evolve/devotion"
          icon={Sparkles}
          title="Daily Devotion"
          description="Pause, reflect and encounter God in today's thought."
        />
        <HubCard
          href="/evolve/books"
          icon={Library}
          title="Books & Literature"
          description="Go deeper through books, teachings and curated resources."
          comingSoon
        />
      </div>
    </main>
  );
}
