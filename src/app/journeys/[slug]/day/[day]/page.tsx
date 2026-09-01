import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getJourneyMeta,
  getJourneySession,
  type JourneySession,
} from "@/lib/content/journeys";

function Step({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        {label}
      </p>
      <p className="text-foreground">{children}</p>
    </div>
  );
}

export default async function JourneySessionPage(
  props: PageProps<"/journeys/[slug]/day/[day]">,
) {
  const { slug, day } = await props.params;
  const dayNumber = Number(day);

  const journey = getJourneyMeta(slug);
  const session: JourneySession | null = getJourneySession(slug, dayNumber);

  if (!journey || !session) {
    notFound();
  }

  const isLastDay = dayNumber >= journey.durationDays;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
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
        <Step label="Scripture">{session.scriptureReference}</Step>
        <Step label="Explore">{session.explore}</Step>
        <Step label="Reflect">{session.reflect}</Step>
        {session.pray && <Step label="Pray">{session.pray}</Step>}
        <Step label="Practice">{session.practice}</Step>
        <Step label="Connect">{session.connect}</Step>
      </div>

      {isLastDay ? (
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-heading font-semibold">
            {journey.completionTitle}
          </h2>
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
        </div>
      ) : (
        <Button
          render={<Link href={`/journeys/${slug}/day/${dayNumber + 1}`} />}
          nativeButton={false}
          size="lg"
        >
          {session.nextTopic ? `Continue: ${session.nextTopic}` : "Continue"}
        </Button>
      )}
    </main>
  );
}
