"use client";

import { useState, useTransition } from "react";
import { Heart, PartyPopper, CheckCircle2, Compass, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HubCard } from "@/components/hub-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { dismissGospelInvite, recordGospelPrayer } from "./actions";

export function GospelInviteCard({
  shouldShow,
  journeyHref,
  dict,
}: {
  shouldShow: boolean;
  journeyHref: string;
  dict: Dictionary["gospelInvite"];
}) {
  const [open, setOpen] = useState(shouldShow);
  const [step, setStep] = useState<"invite" | "began">("invite");
  const [, startTransition] = useTransition();

  if (!open) {
    return null;
  }

  function handleMaybeLater() {
    setOpen(false);
    startTransition(() => {
      dismissGospelInvite();
    });
  }

  function handlePrayed() {
    setStep("began");
    startTransition(() => {
      recordGospelPrayer();
    });
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={step === "invite" ? handleMaybeLater : () => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gospel-invite-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-sm space-y-5 overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
      >
        {step === "invite" ? (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <Heart className="size-8 text-primary" />
              <h2
                id="gospel-invite-title"
                className="font-heading text-xl font-bold text-balance"
              >
                {dict.heading}
              </h2>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-xs text-muted-foreground">
                {dict.jesusSaid}
              </p>
              <p className="text-lg font-medium text-balance">
                &ldquo;{dict.scriptureQuote}&rdquo;
              </p>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {dict.scriptureRef}
              </p>
            </div>

            <p className="text-center text-sm text-muted-foreground text-balance">
              {dict.intro}
            </p>

            <div className="space-y-2 rounded-xl bg-muted p-4">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                {dict.prayerLabel}
              </p>
              <p className="text-sm leading-relaxed">{dict.prayerText}</p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                className="w-full rounded-full"
                onClick={handlePrayed}
              >
                <CheckCircle2 className="size-4" />
                {dict.prayedButton}
              </Button>
              <button
                type="button"
                onClick={handleMaybeLater}
                className="mx-auto block text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                {dict.maybeLater}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <PartyPopper className="size-8 text-primary" />
              <h2 className="font-heading text-xl font-bold text-balance">
                {dict.beganHeading}
              </h2>
              <p className="text-sm text-muted-foreground">
                {dict.beganSubheading}
              </p>
            </div>

            <p className="text-center text-sm font-medium">
              {dict.whereNext}
            </p>

            <div className="space-y-2">
              <HubCard
                href={journeyHref}
                icon={Compass}
                title={dict.hubJourneyTitle}
                description={dict.hubJourneyDesc}
              />
              <HubCard
                href="/companion?intent=new-believer"
                icon={MessageCircle}
                title={dict.hubCompanionTitle}
                description={dict.hubCompanionDesc}
              />
              <HubCard
                href="/evolve/scripture"
                icon={BookOpen}
                title={dict.hubScriptureTitle}
                description={dict.hubScriptureDesc}
              />
            </div>

            <p className="text-center text-xs text-muted-foreground text-balance">
              {dict.closing}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
