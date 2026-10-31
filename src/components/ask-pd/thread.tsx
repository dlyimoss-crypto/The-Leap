import { Phone, Video, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_METHOD_LABELS,
  formatAskPdTime,
  type AskPdMessage,
  type AskPdRequest,
} from "@/lib/supabase/ask-pd";

const CONTACT_ICONS = { whatsapp: MessageCircle, phone: Phone, video: Video };

// The details of a call request: how and when the person wants to be
// reached. Shown to both sides of the conversation.
export function CallRequestDetails({ request }: { request: AskPdRequest }) {
  if (request.kind !== "call" || !request.contact_method) {
    return null;
  }
  const Icon = CONTACT_ICONS[request.contact_method];
  return (
    <div className="space-y-1.5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Call request
      </p>
      <p className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        {CONTACT_METHOD_LABELS[request.contact_method]}:{" "}
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
export function AskPdMessages({
  messages,
  viewer,
  requesterName,
}: {
  messages: AskPdMessage[];
  viewer: "user" | "team";
  requesterName?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => {
        const mine = viewer === "team" ? m.from_team : !m.from_team;
        const name = m.from_team
          ? m.author?.display_name || "Pastor Deniss"
          : viewer === "user"
            ? "You"
            : requesterName || "User";
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
              {name} · {formatAskPdTime(m.created_at)}
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

export function ReplyForm({
  action,
  placeholder,
}: {
  action: (formData: FormData) => Promise<void>;
  placeholder: string;
}) {
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
          Send
        </Button>
      </div>
    </form>
  );
}

export function CrisisNotice() {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
      You don&apos;t have to go through this alone. A reply here can take
      time, so if you&apos;re in immediate danger or thinking about harming
      yourself, please get help now.{" "}
      <a
        href="https://findahelpline.com"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-destructive underline"
      >
        Find crisis support in your country →
      </a>{" "}
      You can also contact a trusted person, a local church, a professional
      counselor, or emergency services.
    </div>
  );
}
