import { Compass, Map } from "lucide-react";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getCurrentJourneyState } from "@/lib/supabase/journey-progress";
import { journeyContinueHref } from "@/lib/journey-nav";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function JourneyChooserPage() {
  const { supabase, user } = await requireUser();

  const { progress, journeySlug } = await getCurrentJourneyState(
    supabase,
    user.id,
  );
  const t = getDictionary(await getLocale()).commit.journeyChooser;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/commit" label={t.backToCommit} />

      <div>
        <h1 className="text-2xl font-heading font-semibold">{t.heading}</h1>
        <p className="text-sm text-muted-foreground">{t.subheading}</p>
      </div>

      <div className="space-y-3">
        <HubCard
          href={journeyContinueHref(journeySlug, progress)}
          icon={Compass}
          title={t.continueTitle}
          description={t.continueDescription}
        />
        <HubCard
          href="/commit/journeys"
          icon={Map}
          title={t.browseTitle}
          description={t.browseDescription}
        />
      </div>
    </main>
  );
}
