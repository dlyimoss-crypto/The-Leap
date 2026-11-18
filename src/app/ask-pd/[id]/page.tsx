import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import {
  AskPdMessages,
  CallRequestDetails,
  CrisisNotice,
  ReplyForm,
} from "@/components/ask-pd/thread";
import { requireUser } from "@/lib/supabase/authorize";
import { askPdStatusLabel, getAskPdThread } from "@/lib/supabase/ask-pd";
import { getLocale } from "@/lib/i18n/get-locale";
import { wordSpace } from "@/lib/i18n/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { replyAsUser } from "../actions";

export default async function AskPdThreadPage(
  props: PageProps<"/ask-pd/[id]">,
) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const { supabase, user } = await requireUser();

  const thread = await getAskPdThread(supabase, id);
  // RLS already hides other people's requests; a team member opening a
  // user link here is sent to the inbox view instead.
  if (!thread) {
    notFound();
  }
  const { request, messages } = thread;
  if (request.user_id !== user.id) {
    redirect(`/ask-pd/inbox/${id}`);
  }

  if (request.user_unread) {
    await supabase.rpc("mark_ask_pd_read", { p_request_id: id });
  }

  const t = getDictionary(await getLocale()).engage.askPd;
  const sp = wordSpace(await getLocale());

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/ask-pd" label={t.title} />

      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-semibold">
          {request.kind === "call" ? t.thread.yourCallRequest : t.thread.yourMessage}
        </h1>
        <p className="text-sm text-muted-foreground">
          {askPdStatusLabel(t, request.status, "user")}
        </p>
      </div>

      {searchParams.sent === "1" && (
        <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            {request.kind === "call" ? t.thread.sentCall : t.thread.sentMessage}
          </p>
        </div>
      )}

      {searchParams.crisis === "1" && <CrisisNotice />}

      <CallRequestDetails request={request} />

      <AskPdMessages messages={messages} viewer="user" />

      {request.status === "closed" ? (
        <p className="rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
          {t.thread.closed}{sp}
          <Link href="/ask-pd" className="font-medium text-primary underline">
            {t.thread.startNewOne}
          </Link>{sp}
          {t.thread.anyTime}
        </p>
      ) : (
        <ReplyForm
          action={replyAsUser.bind(null, id)}
          placeholder={t.thread.followUpPlaceholder}
        />
      )}
    </main>
  );
}
