import { Phone, Video, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  formatAskPdTime,
  type AskPdMessage,
  type AskPdRequest,
} from "@/lib/supabase/ask-pd";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const CONTACT_ICONS = { whatsapp: MessageCircle, phone: Phone, video: Video };

// The details of a call request: how and when the person wants to be
// reached. Shown to both sides of the conversation.
export async function CallRequestDetails({ request }: { request: AskPdRequest }) {
  if (request.kind !== "call" || !request.contact_method) {
    return null;
  }
  const t = getDictionary(await getLocale()).engage.askPd;
  const Icon = CONTACT_ICONS[request.contact_method];
  return (
    <div className="space-y-1.5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {t.thread.callRequest}
      </p>
      <p className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        {t.contactMethods[request.contact_method]}:{" "}
        <span className="font-medium">{request.contact_detail}</span>
      </p>
      {request.preferred_time && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          {request.preferred_time}
        </p>
      )}
    </div>
  );
}

// The message bubbles. `viewer` decides whose messages sit on the right:
// the user's own on their side, the team's on the inbox side.
export async function AskPdMessages({
  messages,
  viewer,
  requesterName,
}: {
  messages: AskPdMessage[];
  viewer: "user" | "team";
  requesterName?: string;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale).engage.askPd.thread;
  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => {
        const mine = viewer === "team" ? m.from_team : !m.from_team;
        const name = m.from_team
          ? m.author?.display_name || t.pastorDeniss
          : viewer === "user"
            ? t.you
            : requesterName || t.userFallback;
        return (
          <div
            key={m.id}
            className={mine ? "ml-auto max-w-[85%] space-y-1" : "mr-auto max-w-[85%] space-y-1"}
          >
            <p
              className={
                mine
                  ? "text-right text-[11px] text-muted-foreground"
                  : "text-[11px] text-muted-foreground"
              }
            >
              {name} · {formatAskPdTime(locale, m.created_at)}
            </p>
            <div
              className={
                mine
                  ? "whitespace-pre-wrap rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                  : "whitespace-pre-wrap rounded-xl border bg-card px-3 py-2 text-sm"
              }
            >
              {m.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export async function ReplyForm({
  action,
  placeholder,
}: {
  action: (formData: FormData) => Promise<void>;
  placeholder: string;
}) {
  const t = getDictionary(await getLocale()).engage.askPd.thread;
  return (
    <form action={action} className="space-y-2">
      <Textarea
        name="body"
        placeholder={placeholder}
        required
        rows={3}
        maxLength={5000}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          {t.send}
        </Button>
      </div>
    </form>
  );
}

export async function CrisisNotice() {
  const t = getDictionary(await getLocale()).engage.askPd.thread;
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
      {t.crisisBefore}{" "}
      <a
        href="https://findahelpline.com"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-destructive underline"
      >
        {t.crisisLink}
      </a>{" "}
      {t.crisisAfter}
    </div>
  );
}
