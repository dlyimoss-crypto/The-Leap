"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CommunityMessages } from "@/lib/i18n/messages/en/community";
import { postPrayerRequest } from "./actions";

function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 font-mono text-[10.5px]",
        active
          ? "border-primary text-primary"
          : "border-border text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function PrayerComposer({
  dict,
}: {
  dict: CommunityMessages["prayerComposer"];
}) {
  const [visibility, setVisibility] = useState<"public" | "private">(
    "public",
  );
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <form
      action={postPrayerRequest}
      className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm"
    >
      <Textarea
        name="body"
        placeholder={dict.placeholder}
        required
        rows={2}
      />
      <input type="hidden" name="visibility" value={visibility} />
      <input type="hidden" name="isAnonymous" value={String(isAnonymous)} />
      <div className="flex flex-wrap items-center gap-2">
        <TogglePill
          active={visibility === "public"}
          onClick={() => setVisibility("public")}
        >
          {dict.public}
        </TogglePill>
        <TogglePill
          active={visibility === "private"}
          onClick={() => setVisibility("private")}
        >
          {dict.private}
        </TogglePill>
        <TogglePill active={!isAnonymous} onClick={() => setIsAnonymous(false)}>
          {dict.identified}
        </TogglePill>
        <TogglePill active={isAnonymous} onClick={() => setIsAnonymous(true)}>
          {dict.anonymous}
        </TogglePill>
        <Button
          type="submit"
          size="icon"
          className="ml-auto rounded-full"
          aria-label={dict.submitAriaLabel}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
}
