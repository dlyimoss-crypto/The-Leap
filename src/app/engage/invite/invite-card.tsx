"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

const INVITE_URL = "https://leapgrow.app";
const INVITE_MESSAGE =
  "I've been using The Leap to grow in my walk with Christ, one day at a time. Take your first Leap too:";

export function InviteCard({ firstName }: { firstName?: string | null }) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: INVITE_MESSAGE, url: INVITE_URL });
        setShared(true);
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${INVITE_MESSAGE} ${INVITE_URL}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy invite", err);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl bg-muted p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Share2 className="size-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="font-heading text-lg font-semibold text-foreground">
            Take someone with you
          </p>
          <p className="text-sm text-muted-foreground">
            {firstName ? `${firstName}, help` : "Help"} a friend or family
            member take their first Leap with Christ.
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full rounded-full"
        onClick={handleShare}
      >
        {shared ? "Invite copied" : "Share The Leap"}
      </Button>

      <div className="rounded-xl border bg-card p-3">
        <CopyButton value={INVITE_URL} className="w-full justify-between" />
      </div>
    </div>
  );
}
