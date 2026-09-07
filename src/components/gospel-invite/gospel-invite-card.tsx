"use client";

import { useState, useTransition } from "react";
import { Heart, PartyPopper, CheckCircle2, Compass, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HubCard } from "@/components/hub-card";
import { dismissGospelInvite, recordGospelPrayer } from "./actions";

const PRAYER_TEXT =
  "Lord Jesus, I believe You are the Son of God. I ask You to forgive my sins and come into my heart. I receive You as my Lord and Savior. Thank You for eternal life. In Jesus' name, Amen.";

// The John 14:6 dataset entry (content/bible/web/faith-in-christ.json)
// carries the full verse for reuse elsewhere in the app's Scripture
// architecture; this card deliberately quotes only the first clause.
const SCRIPTURE_QUOTE = "I am the way, the truth, and the life.";

export function GospelInviteCard({
  shouldShow,
  journeyHref,
}: {
  shouldShow: boolean;
  journeyHref: string;
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
                Do You Know Jesus?
              </h2>
            </div>

            <div className="space-y-1 text-center">
              <p className="text-xs text-muted-foreground">Jesus said:</p>
              <p className="text-lg font-medium text-balance">
                &ldquo;{SCRIPTURE_QUOTE}&rdquo;
              </p>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                John 14:6
              </p>
            </div>

            <p className="text-center text-sm text-muted-foreground text-balance">
              If you&apos;re ready to begin a relationship with Jesus, you can
              start with a simple prayer.
            </p>

            <div className="space-y-2 rounded-xl bg-muted p-4">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                A Simple Prayer
              </p>
              <p className="text-sm leading-relaxed">{PRAYER_TEXT}</p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                className="w-full rounded-full"
                onClick={handlePrayed}
              >
                <CheckCircle2 className="size-4" />I Prayed This Prayer
              </Button>
              <button
                type="button"
                onClick={handleMaybeLater}
                className="mx-auto block text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                Maybe Later
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <PartyPopper className="size-8 text-primary" />
              <h2 className="font-heading text-xl font-bold text-balance">
                Your Journey Has Begun
              </h2>
              <p className="text-sm text-muted-foreground">
                You have taken an important step today.
              </p>
            </div>

            <p className="text-center text-sm font-medium">
              Where would you like to go next?
            </p>

            <div className="space-y-2">
              <HubCard
                href={journeyHref}
                icon={Compass}
                title="Begin Your First Leap"
                description="Start your first guided formation journey."
              />
              <HubCard
                href="/companion?intent=new-believer"
                icon={MessageCircle}
                title="Meet Your Companion"
                description="An AI guide who can help you take your next steps."
              />
              <HubCard
                href="/evolve/scripture"
                icon={BookOpen}
                title="Explore Scripture"
                description="Begin discovering God's Word."
              />
            </div>

            <p className="text-center text-xs text-muted-foreground text-balance">
              Thank you for taking this step. Following Jesus is a journey,
              and you don&apos;t have to walk it alone.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
