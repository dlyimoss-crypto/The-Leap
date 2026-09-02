import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LeapMark } from "@/components/leap-mark";
import type { JourneyMeta } from "@/lib/content/journeys";
import { signOut } from "./sign-in/actions";

type JourneyProgress = {
  current_session_number: number;
  completed_at: string | null;
};

export function DashboardView({
  journey,
  progress,
  nextSessionTitle,
  isAdmin,
}: {
  journey: JourneyMeta;
  progress: JourneyProgress | null;
  nextSessionTitle: string | null;
  isAdmin: boolean;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <LeapMark className="h-8 w-8 text-primary" />
        <div className="flex items-center gap-1">
          <Button
            render={<Link href="/prayer-room" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            Prayer Room
          </Button>
          <Button
            render={<Link href="/community" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
          >
            Community
          </Button>
          {isAdmin && (
            <Button
              render={<Link href="/admin" />}
              nativeButton={false}
              variant="ghost"
              size="sm"
            >
              Admin
            </Button>
          )}
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {!progress && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-heading font-semibold text-balance">
              Ready for your next step?
            </h1>
            <p className="text-muted-foreground">{journey.purpose}</p>
          </div>
          <Button
            render={<Link href={`/journeys/${journey.slug}`} />}
            nativeButton={false}
            size="lg"
            className="w-full max-w-xs"
          >
            Begin my journey
          </Button>
        </div>
      )}

      {progress && !progress.completed_at && (
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="space-y-3">
            <Progress
              value={
                ((progress.current_session_number - 1) /
                  journey.durationDays) *
                100
              }
            />
            <p className="text-sm text-muted-foreground">
              Day {progress.current_session_number} of {journey.durationDays}{" "}
              &middot; {journey.title}
            </p>
          </div>

          <div className="space-y-3 rounded-xl border bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Next step
            </p>
            <h2 className="text-xl font-heading font-semibold text-balance">
              {nextSessionTitle}
            </h2>
            <Button
              render={
                <Link
                  href={`/journeys/${journey.slug}/day/${progress.current_session_number}`}
                />
              }
              nativeButton={false}
              size="lg"
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {progress?.completed_at && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-heading font-semibold text-balance">
            {journey.completionTitle}
          </h1>
          <p className="text-muted-foreground">
            You&apos;ve completed {journey.title}.
          </p>
          <Button
            render={<Link href={`/journeys/${journey.slug}/day/1`} />}
            nativeButton={false}
            variant="outline"
          >
            Review the journey
          </Button>
        </div>
      )}
    </main>
  );
}
