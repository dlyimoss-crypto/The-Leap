import { TranslationNotice } from "@/components/language/translation-notice";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { findJourneyMeta } from "@/lib/content/journeys-repo";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function JourneyOverviewPage(
  props: PageProps<"/journeys/[slug]">,
) {
  const { slug } = await props.params;

  const { supabase } = await requireUser();
  const locale = await getLocale();
  const t = getDictionary(locale).commit.journeyOverview;

  const journey = await findJourneyMeta(supabase, slug, locale);

  if (!journey) {
    notFound();
  }

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 overflow-hidden px-6 py-16">
      <PatternBorder />
      <div className="space-y-2">
        <TranslationNotice servedLocale={journey.servedLocale} />
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          {t.durationLabel(journey.durationDays)}
        </p>
        <h1 lang={journey.servedLocale} className="text-3xl font-heading font-semibold text-balance">
          {journey.title}
        </h1>
        <p lang={journey.servedLocale} className="text-muted-foreground">{journey.purpose}</p>
      </div>

      <Button
        render={<Link href={`/journeys/${journey.slug}/day/1`} />}
        nativeButton={false}
        size="lg"
      >
        {t.startJourney}
      </Button>
    </main>
  );
}
