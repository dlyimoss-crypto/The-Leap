import Link from "next/link";
import {
  LogOut,
  BookOpen,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Flag,
  HeartHandshake,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PatternCorner } from "@/components/pattern-bg";
import type { JourneyMeta } from "@/lib/content/journeys";
import type { JourneyProgressRow } from "@/lib/supabase/journey-progress";
import { journeyContinueHref } from "@/lib/journey-nav";
import { getJourneyCompleteImage } from "@/lib/journey-complete-image";
import {
  getPrayerMovementDaysLeft,
  type PrayerMovement,
} from "@/lib/supabase/prayer-movements";
import { GospelInviteCard } from "@/components/gospel-invite/gospel-invite-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { signOut } from "./sign-in/actions";

type JourneyProgress = JourneyProgressRow;

function greeting(dict: Dictionary) {
  const hour = new Date().getHours();
  if (hour < 12) return dict.dashboard.goodMorning;
  if (hour < 18) return dict.dashboard.goodAfternoon;
  return dict.dashboard.goodEvening;
}

// A journey's purpose can run to several sentences — fine for its own
// overview page, too much for a teaser line on a card. Cut to a whole word
// so a full-length purpose (like Faith in Christ's) still passes through
// untouched.
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

// A day-at-a-time line rather than a filled pill: the marker sits at the
// current day's position along the track, so progress reads as "here's
// where you are on the plan" instead of a raw percentage.
function JourneyProgressBar({
  currentSessionNumber,
  durationDays,
  dict,
}: {
  currentSessionNumber: number;
  durationDays: number;
  dict: Dictionary;
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
        <span>{dict.dashboard.percentComplete(percentComplete)}</span>
        <span>{dict.dashboard.daysLeft(daysRemaining)}</span>
      </div>
    </div>
  );
}

type NextJourney = {
  slug: string;
  title: string;
  purpose: string;
  teaser?: string | null;
};

export function DashboardView({
  journey,
  progress,
  dict,
  displayName,
  avatarUrl,
  nextJourney,
  commitmentProgress,
  prayerMovement,
  showGospelInvite,
}: {
  journey: JourneyMeta;
  progress: JourneyProgress | null;
  dict: Dictionary;
  displayName: string | null;
  avatarUrl: string | null;
  nextJourney?: NextJourney | null;
  commitmentProgress?: { done: number; total: number } | null;
  prayerMovement?: PrayerMovement | null;
  showGospelInvite?: boolean;
}) {
  const firstName = displayName?.split(" ")[0];

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-8 overflow-hidden px-6 py-10">
      <GospelInviteCard
        shouldShow={!!showGospelInvite}
        journeyHref={journeyContinueHref(journey.slug, progress)}
        dict={dict.gospelInvite}
      />
      <PatternCorner corner="top-right" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/profile" aria-label={dict.dashboard.editProfileAriaLabel}>
            <Avatar name={displayName} src={avatarUrl} />
          </Link>
          <div>
            <p className="font-heading text-lg font-semibold">
              {greeting(dict)}
              {firstName ? `, ${firstName}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {dict.dashboard.tagline}
            </p>
          </div>
        </div>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            aria-label={dict.dashboard.signOutAriaLabel}
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
                {dict.dashboard.welcomeEyebrow}
              </p>
              <h1 className="font-heading text-2xl font-bold text-foreground text-balance">
                {dict.dashboard.beginJourneyHeading}
              </h1>
              <p className="text-sm text-muted-foreground">
                {truncate(journey.teaser ?? journey.purpose, 100)}
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
            {dict.dashboard.beginMyJourney}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {progress && !progress.completed_at && (
        <div className="space-y-4 rounded-2xl bg-muted p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {dict.dashboard.continueYourJourneyEyebrow}
              </p>
              <h1 className="font-heading text-2xl font-bold text-foreground text-balance">
                {journey.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {dict.dashboard.dayOf(
                  progress.current_session_number,
                  journey.durationDays,
                )}
              </p>
              {journey.teaser && (
                <p className="text-sm text-muted-foreground">
                  {truncate(journey.teaser, 100)}
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
            dict={dict}
          />

          <Button
            render={<Link href={journeyContinueHref(journey.slug, progress)} />}
            nativeButton={false}
            size="lg"
            className="w-full rounded-full"
          >
            {dict.dashboard.continueTheJourney}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {progress?.completed_at && (
        <div className="space-y-4 rounded-2xl bg-muted p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {nextJourney
                  ? dict.dashboard.nextLeapEyebrow
                  : dict.dashboard.journeyCompleteEyebrow}
              </p>
              <h1 className="font-heading text-2xl font-bold text-foreground text-balance">
                {nextJourney
                  ? dict.dashboard.welcomeToNextLeap
                  : journey.completionTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {nextJourney
                  ? `${nextJourney.title} — ${truncate(nextJourney.teaser ?? nextJourney.purpose, 100)}`
                  : dict.dashboard.onlyBeginning}
              </p>
            </div>
            <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getJourneyCompleteImage()}
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
              <span>{dict.dashboard.percentComplete(100)}</span>
              <span>{dict.dashboard.done}</span>
            </div>
          </div>

          <Button
            render={
              <Link
                href={
                  nextJourney
                    ? `/journeys/${nextJourney.slug}`
                    : journeyContinueHref(journey.slug, progress)
                }
              />
            }
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full rounded-full"
          >
            {dict.dashboard.continueButton}
            <ArrowRight className="size-4" />
          </Button>

          <Link
            href="/commit/journeys"
            className="mx-auto block w-fit rounded-full bg-background px-4 py-1.5 text-center text-xs font-medium text-foreground hover:bg-background/80"
          >
            {dict.dashboard.browseOtherJourneys}
          </Link>
        </div>
      )}

      {prayerMovement && (
        <Link
          href="/prayer-room"
          className="flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-card p-4 hover:bg-muted/50"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <HeartHandshake className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{prayerMovement.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {(() => {
                const daysLeft = getPrayerMovementDaysLeft(
                  prayerMovement.active_until,
                );
                return daysLeft !== null
                  ? dict.dashboard.prayerDaysLeft(daysLeft)
                  : dict.dashboard.tapToPray;
              })()}
            </p>
          </div>
        </Link>
      )}

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {dict.dashboard.today}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/evolve/scripture"
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-4 text-center hover:bg-muted/50"
          >
            <BookOpen className="size-5 text-primary" />
            <p className="text-sm font-medium">{dict.dashboard.scripture}</p>
            <p className="text-xs text-muted-foreground">
              {dict.dashboard.readGodsWord}
            </p>
          </Link>
          <Link
            href="/evolve/devotion"
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-4 text-center hover:bg-muted/50"
          >
            <Sparkles className="size-5 text-primary" />
            <p className="text-sm font-medium">{dict.dashboard.devotion}</p>
            <p className="text-xs text-muted-foreground">
              {dict.dashboard.growDaily}
            </p>
          </Link>
        </div>
      </div>

      <Link
        href="/commit"
        className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:bg-muted/50"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Flag className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {commitmentProgress
              ? dict.dashboard.thisWeeksCommitment
              : dict.dashboard.makeACommitment}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {commitmentProgress
              ? dict.dashboard.keptThisWeek(
                  commitmentProgress.done,
                  commitmentProgress.total,
                )
              : dict.dashboard.studyPrayShare}
          </p>
        </div>
      </Link>

      <Link
        href="/companion"
        className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:bg-muted/50"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <MessageCircle className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{dict.dashboard.leapCompanion}</p>
          <p className="text-xs text-muted-foreground">
            {dict.dashboard.askForHelp}
          </p>
        </div>
      </Link>
    </main>
  );
}
