import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { findJourneyMeta } from "@/lib/content/journeys-repo";

export default async function JourneyOverviewPage(
  props: PageProps<"/journeys/[slug]">,
) {
  const { slug } = await props.params;

  const { supabase } = await requireUser();

  const journey = await findJourneyMeta(supabase, slug);

  if (!journey) {
    notFound();
  }

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 overflow-hidden px-6 py-16">
      <PatternBorder />
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          {journey.durationDays}-day formation journey
        </p>
        <h1 className="text-3xl font-heading font-semibold text-balance">
          {journey.title}
        </h1>
        <p className="text-muted-foreground">{journey.purpose}</p>
      </div>

      <Button
        render={<Link href={`/journeys/${journey.slug}/day/1`} />}
        nativeButton={false}
        size="lg"
      >
        Start journey
      </Button>
    </main>
  );
}
