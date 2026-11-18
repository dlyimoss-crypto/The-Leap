import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCommunityPlaceholder } from "@/lib/content/community-placeholder-prompts";
import type { CommunityMessages } from "@/lib/i18n/messages/en/community";
import { createPost } from "./actions";

export function Composer({
  prompt,
  dict,
}: {
  prompt: string | null;
  dict: CommunityMessages["composer"];
}) {
  return (
    <form
      action={createPost}
      className="space-y-2 rounded-2xl border bg-card p-4 shadow-sm"
    >
      {prompt && (
        <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-primary">
          {dict.todaysQuestion}
        </p>
      )}
      <Textarea
        name="body"
        placeholder={prompt ?? getCommunityPlaceholder(new Date(), dict.placeholderPrompts)}
        required
        rows={2}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          aria-label={dict.submitAriaLabel}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
}
