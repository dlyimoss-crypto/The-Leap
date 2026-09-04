import Link from "next/link";
import { LogOut, BookOpen, Sparkles, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { JourneyMeta } from "@/lib/content/journeys";
import type { JourneyProgressRow } from "@/lib/supabase/journey-progress";
import { journeyContinueHref } from "@/lib/journey-nav";
import { signOut } from "./sign-in/actions";

type JourneyProgress = JourneyProgressRow;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView({
  journey,
  progress,
  nextSessionTitle,
  displayName,
}: {
  journey: JourneyMeta;
  progress: JourneyProgress | null;
  nextSessionTitle: string | null;
  displayName: string | null;
}) {
  const firstName = displayName?.split(" ")[0];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={displayName} />
          <p className="font-heading text-lg font-semibold">
            {greeting()}
            {firstName ? `, ${firstName}` : ""}
          </p>
        </div>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </form>
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
            render={<Link href={journeyContinueHref(journey.slug, progress)} />}
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
                <Link href={journeyContinueHref(journey.slug, progress)} />
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
            render={<Link href={journeyContinueHref(journey.slug, progress)} />}
            nativeButton={false}
            variant="outline"
          >
            Review the journey
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Today
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/evolve/scripture"
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-4 text-center hover:bg-muted/50"
          >
            <BookOpen className="size-5 text-primary" />
            <p className="text-sm font-medium">Scripture</p>
            <p className="text-xs text-muted-foreground">Read God&apos;s Word</p>
          </Link>
          <Link
            href="/evolve/devotion"
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-4 text-center hover:bg-muted/50"
          >
            <Sparkles className="size-5 text-primary" />
            <p className="text-sm font-medium">Devotion</p>
            <p className="text-xs text-muted-foreground">Grow daily</p>
          </Link>
        </div>
      </div>

      <Link
        href="/companion"
        className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:bg-muted/50"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <MessageCircle className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Leap Companion</p>
          <p className="text-xs text-muted-foreground">
            Ask for help, prayer, or your next step.
          </p>
        </div>
      </Link>
    </main>
  );
}
