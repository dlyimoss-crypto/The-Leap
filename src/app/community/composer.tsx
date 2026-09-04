import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "./actions";

export function Composer({ prompt }: { prompt: string | null }) {
  return (
    <form
      action={createPost}
      className="space-y-2 rounded-2xl border bg-card p-4 shadow-sm"
    >
      {prompt && (
        <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-primary">
          Today&apos;s question
        </p>
      )}
      <Textarea
        name="body"
        placeholder={prompt ?? "Share what's on your mind…"}
        required
        rows={2}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          aria-label="Post"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
}
