import { redirect } from "next/navigation";
import { CheckCircle2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import {
  getActiveCommitment,
  getCommitmentHistory,
} from "@/lib/supabase/commitments";
import { createCommitment, completeCommitment } from "./actions";

function formatWeekOf(weekOf: string) {
  return new Date(`${weekOf}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function CommitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [active, history] = await Promise.all([
    getActiveCommitment(supabase, user.id),
    getCommitmentHistory(supabase, user.id),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Commit</h1>
        <p className="text-sm text-muted-foreground">
          I choose the way of Christ.
        </p>
      </div>

      {active ? (
        <div className="space-y-4 rounded-2xl bg-muted p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Flag className="size-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                This week&apos;s commitment
              </p>
              <p className="font-heading text-lg font-semibold text-foreground text-balance">
                {active.body}
              </p>
              <p className="text-xs text-muted-foreground">
                Week of {formatWeekOf(active.week_of)}
              </p>
            </div>
          </div>

          <form action={completeCommitment.bind(null, active.id)}>
            <Button type="submit" size="lg" className="w-full rounded-full">
              <CheckCircle2 className="size-4" />
              Mark as kept
            </Button>
          </form>
        </div>
      ) : (
        <form
          action={createCommitment}
          className="space-y-3 rounded-2xl bg-muted p-5"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Set this week&apos;s commitment
            </p>
            <p className="text-sm text-muted-foreground">
              One thing you&apos;ll choose to do this week — small enough to
              actually keep.
            </p>
          </div>
          <Textarea
            name="body"
            rows={3}
            placeholder="e.g. Reading my Bible, 5 paragraphs each day"
            required
          />
          <Button type="submit" size="lg" className="w-full rounded-full">
            Commit to this
          </Button>
        </form>
      )}

      {history.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Kept commitments
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {history.map((commitment) => (
              <div key={commitment.id} className="flex items-start gap-3 p-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm">{commitment.body}</p>
                  <p className="text-xs text-muted-foreground">
                    Week of {formatWeekOf(commitment.week_of)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
