"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { interpolate } from "@/lib/i18n/format";

const INVITE_URL = "https://leapgrow.app";

export function InviteCard({
  firstName,
  dict,
}: {
  firstName?: string | null;
  dict: Dictionary["engage"]["invite"]["card"];
}) {
  const [shared, setShared] = useState(false);
  const inviteMessage = dict.shareMessage;

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: inviteMessage, url: INVITE_URL });
        setShared(true);
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${inviteMessage} ${INVITE_URL}`);
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
            {dict.heading}
          </p>
          <p className="text-sm text-muted-foreground">
            {firstName
              ? interpolate(dict.helpWithName, { name: firstName })
              : dict.help}
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full rounded-full"
        onClick={handleShare}
      >
        {shared ? dict.inviteCopied : dict.shareTheLeap}
      </Button>

      <div className="rounded-xl border bg-card p-3">
        <CopyButton value={INVITE_URL} className="w-full justify-between" />
      </div>
    </div>
  );
}
