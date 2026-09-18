import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Step } from "@/components/step";
import { PatternBorder } from "@/components/pattern-bg";
import { findJourneyMeta, findJourneySession } from "@/lib/content/journeys-repo";
import { requireUser } from "@/lib/supabase/authorize";
import { isDayGatedUntilTomorrow } from "@/lib/supabase/journey-progress";
import { getScripturePassages } from "@/lib/content/scripture";
import { completeSession } from "./actions";

export default async function JourneySessionPage(
  props: PageProps<"/journeys/[slug]/day/[day]">,
) {
  const { slug, day } = await props.params;
  const dayNumber = Number(day);

  const { supabase, user } = await requireUser();

  const [journey, session] = await Promise.all([
    findJourneyMeta(supabase, slug),
    findJourneySession(supabase, slug, dayNumber),
  ]);

  if (!journey || !session) {
    notFound();
  }

  const gated = await isDayGatedUntilTomorrow(
    supabase,
    user.id,
    slug,
    dayNumber,
  );

  if (gated) {
    return (
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-6 py-16 text-center">
        <PatternBorder />
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Day {dayNumber} of {journey.durationDays} &middot; {journey.title}
        </p>
        <h1 className="text-2xl font-heading font-semibold text-balance">
          Welcome back tomorrow
        </h1>
        <p className="text-sm text-muted-foreground">
          Take today to pray and sit with what you&apos;ve just read — the
          next step opens when you return tomorrow.
        </p>
        <Button render={<Link href="/" />} nativeButton={false} size="lg">
          Back to Home
        </Button>
      </main>
    );
  }

  const isLastDay = dayNumber >= journey.durationDays;
  const passages = getScripturePassages(session.scriptureReference);
  const hasMatchedPassage = passages.some((p) => p.passage);

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <div className="space-y-3">
        <Progress value={(dayNumber / journey.durationDays) * 100} />
        <p className="text-sm text-muted-foreground">
          Day {session.day} of {journey.durationDays} &middot; {journey.title}
        </p>
        <h1 className="text-2xl font-heading font-semibold text-balance">
          {session.title}
        </h1>
      </div>

      <div className="space-y-5 rounded-xl border bg-card p-5">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Scripture
          </p>
          {hasMatchedPassage ? (
            passages.map(({ reference, passage }) =>
              passage ? (
                <div
                  key={reference}
                  className="space-y-1 rounded-lg border border-primary/20 bg-primary/5 p-3"
                >
                  <p className="text-foreground italic">{passage.text}</p>
                  <cite className="block text-sm text-muted-foreground italic">
                    {passage.reference} ({passage.translation})
                  </cite>
                </div>
              ) : (
                <div
                  key={reference}
                  className="rounded-lg border border-primary/20 bg-primary/5 p-3"
                >
                  <p className="text-foreground italic">{reference}</p>
                </div>
              ),
            )
          ) : (
            // None of the ";"-split segments matched the curated dataset —
            // the reference is likely free text (e.g. a quote containing
            // semicolons), so show it as one block instead of fragments.
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-foreground italic">
                {session.scriptureReference}
              </p>
            </div>
          )}
        </div>
        <Step label="Message">{session.message}</Step>
        <Step label="Explore">{session.explore}</Step>
        <Step label="Reflect">{session.reflect}</Step>
        {session.pray && <Step label="Pray">{session.pray}</Step>}
      </div>

      {isLastDay && (
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-heading font-semibold">
            {journey.completionTitle}
          </h2>
        </div>
      )}
      <form
        action={completeSession.bind(
          null,
          slug,
          dayNumber,
          journey.durationDays,
        )}
      >
        <Button type="submit" size="lg" className="w-full">
          {isLastDay
            ? "Continue"
            : session.nextTopic
              ? `Continue: ${session.nextTopic}`
              : "Continue"}
        </Button>
      </form>
    </main>
  );
}
