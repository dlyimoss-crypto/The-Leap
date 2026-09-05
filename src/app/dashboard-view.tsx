import Link from "next/link";
import {
  LogOut,
  BookOpen,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

// Text on the orange fill uses primary-foreground (dark charcoal), not the
// requested light grey — light-on-orange only reaches ~2.6:1 contrast (same
// reasoning as the brand refresh's primary-foreground choice, see
// globals.css); light grey stays for the label over the plain track, where
// it's actually legible.
function JourneyProgressBar({
  currentSessionNumber,
  durationDays,
}: {
  currentSessionNumber: number;
  durationDays: number;
}) {
  const percentComplete = Math.round(
    ((currentSessionNumber - 1) / durationDays) * 100,
  );
  const daysRemaining = Math.max(durationDays - (currentSessionNumber - 1), 0);

  return (
    <div className="relative h-8 overflow-hidden rounded-full bg-muted">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]"
        style={{ width: `${percentComplete}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-3 text-[11px] font-medium">
        <span className="text-primary-foreground">
          {percentComplete}% complete
        </span>
        <span className="text-muted-foreground">
          {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  );
}

export function DashboardView({
  journey,
  progress,
  scriptureReference,
  displayName,
  avatarUrl,
}: {
  journey: JourneyMeta;
  progress: JourneyProgress | null;
  scriptureReference: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}) {
  const firstName = displayName?.split(" ")[0];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/profile" aria-label="Edit your profile">
            <Avatar name={displayName} src={avatarUrl} />
          </Link>
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
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Continue Your Journey
              </p>
              <h1 className="font-heading text-2xl font-bold text-foreground text-balance">
                {journey.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Day {progress.current_session_number} of{" "}
                {journey.durationDays}
              </p>
              {scriptureReference && (
                <p className="text-sm text-muted-foreground">
                  {scriptureReference}
                </p>
              )}
            </div>
            <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/journey-trail.jpg"
                alt=""
                className="size-full object-cover"
              />
            </div>
          </div>

          <JourneyProgressBar
            currentSessionNumber={progress.current_session_number}
            durationDays={journey.durationDays}
          />

          <Button
            render={<Link href={journeyContinueHref(journey.slug, progress)} />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full"
          >
            Continue the journey
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {progress?.completed_at && (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Journey Complete
              </p>
              <h1 className="font-heading text-2xl font-bold text-foreground text-balance">
                {journey.completionTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                You&apos;ve completed {journey.title}.
              </p>
            </div>
            <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/journey-trail.jpg"
                alt=""
                className="size-full object-cover"
              />
            </div>
          </div>

          <div className="relative h-8 overflow-hidden rounded-full bg-muted">
            <div className="absolute inset-0 rounded-full bg-primary" />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-[11px] font-medium">
              <span className="text-primary-foreground">100% complete</span>
              <span className="text-primary-foreground">Done</span>
            </div>
          </div>

          <Button
            render={<Link href={journeyContinueHref(journey.slug, progress)} />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full"
          >
            Review the journey
            <ArrowRight className="size-4" />
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
