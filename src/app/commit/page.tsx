import { CheckCircle2, Circle, Compass, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HubCard } from "@/components/hub-card";
import { BackLink } from "@/components/back-link";
import { PatternCorner } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import {
  COMMITMENT_ITEMS,
  commitmentItemsDone,
  getActiveCommitment,
  getCommitmentHistory,
} from "@/lib/supabase/commitments";
import {
  createCommitment,
  completeCommitment,
  toggleCommitmentItem,
} from "./actions";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatDate } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";

function formatWeekOf(locale: Locale, weekOf: string) {
  return formatDate(locale, weekOf, {
    month: "short",
    day: "numeric",
  });
}

export default async function CommitPage() {
  const { supabase, user } = await requireUser();
  const locale = await getLocale();
  const dict = getDictionary(locale).commit;
  const t = dict.commitPage;

  const [active, history] = await Promise.all([
    getActiveCommitment(supabase, user.id),
    getCommitmentHistory(supabase, user.id),
  ]);

  const doneCount = active ? commitmentItemsDone(active) : 0;
  const allDone = doneCount === COMMITMENT_ITEMS.length;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternCorner corner="top-right" />
      <BackLink href="/" label={t.backToHome} />

      <div>
        <h1 className="text-2xl font-heading font-semibold">{t.heading}</h1>
        <p className="text-sm text-muted-foreground">{t.subheading}</p>
      </div>

      <HubCard
        href="/commit/journey"
        icon={Compass}
        title={t.journeyCardTitle}
        description={t.journeyCardDescription}
      />

      {active ? (
        <div className="space-y-4 rounded-2xl bg-muted p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Flag className="size-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.thisWeeksCommitment}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.weekOfProgress(
                  formatWeekOf(locale, active.week_of),
                  doneCount,
                  COMMITMENT_ITEMS.length,
                )}
              </p>
            </div>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-xl border bg-card">
            {COMMITMENT_ITEMS.map((item) => {
              const checked = active[item.key];
              return (
                <form
                  key={item.key}
                  action={toggleCommitmentItem.bind(
                    null,
                    active.id,
                    item.key,
                    !checked,
                  )}
                >
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 p-3 text-start hover:bg-muted/50"
                  >
                    {checked ? (
                      <CheckCircle2 className="size-5 shrink-0 text-primary" />
                    ) : (
                      <Circle className="size-5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{dict.commitmentItems[item.key].label}</p>
                      <p className="text-xs text-muted-foreground">
                        {dict.commitmentItems[item.key].detail}
                      </p>
                    </div>
                  </button>
                </form>
              );
            })}
          </div>

          <form action={completeCommitment.bind(null, active.id)}>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={!allDone}
            >
              <CheckCircle2 className="size-4" />
              {allDone
                ? t.markAsKept
                : t.checkAllToMarkAsKept(COMMITMENT_ITEMS.length)}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl bg-muted p-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.thisWeeksCommitment}
            </p>
            <p className="text-sm text-muted-foreground">{t.intro}</p>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-xl border bg-card">
            {COMMITMENT_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center gap-3 p-3">
                <Circle className="size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{dict.commitmentItems[item.key].label}</p>
                  <p className="text-xs text-muted-foreground">
                    {dict.commitmentItems[item.key].detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form action={createCommitment}>
            <Button type="submit" size="lg" className="w-full rounded-full">
              {t.commitToThisWeek}
            </Button>
          </form>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t.keptCommitments}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {history.map((commitment) => (
              <div key={commitment.id} className="flex items-start gap-3 p-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm">{commitment.body}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.weekOf(formatWeekOf(locale, commitment.week_of))}
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
