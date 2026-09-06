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

// A day-at-a-time line rather than a filled pill: the marker sits at the
// current day's position along the track, so progress reads as "here's
// where you are on the plan" instead of a raw percentage.
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
    <div className="space-y-2">
      <div className="relative h-1.5 w-full rounded-full bg-card">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]"
          style={{ width: `${percentComplete}%` }}
        />
        <div
          className="absolute top-1/2 size-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-background bg-primary shadow-sm transition-[left]"
          style={{ left: `${percentComplete}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>{percentComplete}% complete</span>
        <span>
          {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
        </span>
      </div>
    </div>
  );
}

type NextJourney = { slug: string; title: string; purpose: string };

export function DashboardView({
  journey,
  progress,
  scriptureReference,
  displayName,
  avatarUrl,
  nextJourney,
}: {
  journey: JourneyMeta;
  progress: JourneyProgress | null;
  scriptureReference: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  nextJourney?: NextJourney | null;
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
        <div className="space-y-4 rounded-2xl bg-muted p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Welcome
              </p>
              <h1 className="font-heading text-2xl font-bold text-foreground text-balance">
                Let&apos;s begin your journey
              </h1>
              <p className="text-sm text-muted-foreground">
                {journey.purpose}
              </p>
            </div>
            <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/journey-trail.jpg"
                alt=""
                className="size-full object-cover"
              />
            </div>
          </div>

          <Button
            render={<Link href={journeyContinueHref(journey.slug, progress)} />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full"
          >
            Begin my journey
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {progress && !progress.completed_at && (
        <div className="space-y-4 rounded-2xl bg-muted p-5">
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
        <div className="space-y-4 rounded-2xl bg-muted p-5">
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

          <div className="space-y-2">
            <div className="relative h-1.5 w-full rounded-full bg-primary">
              <div className="absolute top-1/2 right-0 size-3 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-background bg-primary shadow-sm" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>100% complete</span>
              <span>Done</span>
            </div>
          </div>

          <Button
            render={<Link href={journeyContinueHref(journey.slug, progress)} />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full rounded-full"
          >
            Review the journey
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {progress?.completed_at && nextJourney && (
        <div className="space-y-3 rounded-2xl border-2 border-dashed border-primary/30 bg-card p-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Take your next Leap
            </p>
            <h2 className="font-heading text-xl font-bold text-foreground text-balance">
              {nextJourney.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {nextJourney.purpose}
            </p>
          </div>
          <Button
            render={<Link href={`/journeys/${nextJourney.slug}`} />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full"
          >
            Start this journey
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {progress?.completed_at && !nextJourney && (
        <Link
          href="/evolve/journeys"
          className="block text-center text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Browse other journeys
        </Link>
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
