import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { Button } from "@/components/ui/button";
import {
  AskPdMessages,
  CallRequestDetails,
  ReplyForm,
} from "@/components/ask-pd/thread";
import { checkForCrisisLanguage } from "@/lib/crisis-detection";
import { requirePdTeam } from "@/lib/supabase/authorize";
import {
  askPdStatusLabel,
  formatAskPdTime,
  getAskPdThread,
} from "@/lib/supabase/ask-pd";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  markAskPdSeenByTeam,
  replyAsTeam,
  setAskPdStatus,
} from "../../actions";

export default async function AskPdInboxThreadPage(
  props: PageProps<"/ask-pd/inbox/[id]">,
) {
  const { id } = await props.params;
  const { supabase } = await requirePdTeam();
  const locale = await getLocale();
  const t = getDictionary(locale).engage.askPd;

  const thread = await getAskPdThread(supabase, id);
  if (!thread) {
    notFound();
  }
  const { request, messages } = thread;

  const { data: requester } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", request.user_id)
    .maybeSingle<{ display_name: string | null }>();
  const requesterName = requester?.display_name || t.inbox.unnamedUser;

  const crisisFlagged = messages.some(
    (m) => !m.from_team && checkForCrisisLanguage(m.body).flagged,
  );

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/ask-pd/inbox" label={t.inbox.title} />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-semibold">{requesterName}</h1>
          <p className="text-sm text-muted-foreground">
            {request.kind === "call"
              ? t.inboxThread.callRequest
              : t.inboxThread.message}{" "}
            ·{" "}
            {askPdStatusLabel(t, request.status, "team")} ·{" "}
            {t.inboxThread.started}{" "}
            {formatAskPdTime(locale, request.created_at)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {request.status === "closed" ? (
            <form action={setAskPdStatus.bind(null, id, "open")}>
              <Button type="submit" size="xs" variant="outline">
                {t.inboxThread.reopen}
              </Button>
            </form>
          ) : (
            <form action={setAskPdStatus.bind(null, id, "closed")}>
              <Button type="submit" size="xs" variant="outline">
                {t.inboxThread.markHandled}
              </Button>
            </form>
          )}
          {request.team_unread && request.status !== "closed" && (
            <form action={markAskPdSeenByTeam.bind(null, id)}>
              <Button type="submit" size="xs" variant="ghost">
                {t.inboxThread.markAsSeen}
              </Button>
            </form>
          )}
        </div>
      </div>

      {crisisFlagged && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {t.inboxThread.crisisWarning}
        </p>
      )}

      <CallRequestDetails request={request} />

      {request.companion_snapshot && request.companion_snapshot.length > 0 && (
        <details className="rounded-xl border bg-muted/40 p-3 text-sm">
          <summary className="flex cursor-pointer items-center gap-2 font-medium">
            <Sparkles className="size-4 text-primary" />
            {t.inboxThread.sharedCompanion(request.companion_snapshot.length)}
          </summary>
          <div className="mt-3 space-y-2">
            {request.companion_snapshot.map((m, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">
                  {m.role === "user" ? requesterName : t.inboxThread.companionAi} ·{" "}
                  {formatAskPdTime(locale, m.created_at)}
                </p>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      <AskPdMessages
        messages={messages}
        viewer="team"
        requesterName={requesterName}
      />

      <ReplyForm
        action={replyAsTeam.bind(null, id)}
        placeholder={t.inboxThread.replyTo(requesterName)}
      />
      <p className="text-xs text-muted-foreground">
        {t.inboxThread.repliesNote}
      </p>
    </main>
  );
}
