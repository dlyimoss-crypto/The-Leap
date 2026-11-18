import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { findAvailableJourneys } from "@/lib/content/journeys-repo";
import { journeyContinueHref } from "@/lib/journey-nav";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { JourneyProgressRow } from "@/lib/supabase/journey-progress";

type ProgressBySlugRow = JourneyProgressRow & { journey_slug: string };

export default async function BrowseJourneysPage() {
  const { supabase, user } = await requireUser();
  const locale = await getLocale();
  const t = getDictionary(locale).commit.browseJourneys;

  const [journeys, { data: progressRows }] = await Promise.all([
    findAvailableJourneys(supabase, locale),
    supabase
      .from("journey_progress")
      .select("journey_slug, current_session_number, completed_at")
      .eq("user_id", user.id)
      .returns<ProgressBySlugRow[]>(),
  ]);

  const progressBySlug = new Map(
    (progressRows ?? []).map((row) => [row.journey_slug, row]),
  );

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/commit/journey" label={t.backToJourney} />

      <div>
        <h1 className="text-2xl font-heading font-semibold">
          {t.heading}
        </h1>
        <p className="text-sm text-muted-foreground">{t.intro}</p>
      </div>

      <div className="space-y-3">
        {journeys.map((journey) => {
          const progress = progressBySlug.get(journey.slug) ?? null;
          const percentComplete = progress
            ? Math.round(
                ((progress.current_session_number - 1) /
                  journey.durationDays) *
                  100,
              )
            : 0;

          return (
            <div
              key={journey.slug}
              className="space-y-3 rounded-2xl border bg-card p-4"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t.durationLabel(journey.durationDays)}
                </p>
                <p className="font-heading text-lg font-semibold text-balance">
                  {journey.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {journey.purpose}
                </p>
              </div>

              <Button
                render={
                  <Link href={journeyContinueHref(journey.slug, progress)} />
                }
                nativeButton={false}
                size="sm"
                variant={progress?.completed_at ? "outline" : "default"}
                className="w-full rounded-full"
              >
                {progress?.completed_at
                  ? t.completedReview
                  : progress
                    ? t.percentContinue(percentComplete)
                    : t.start}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          );
        })}

        {journeys.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Compass className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {t.empty}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
