import Link from "next/link";
import { MessageSquareText, PhoneCall, ChevronRight } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireUser } from "@/lib/supabase/authorize";
import {
  askPdStatusLabel,
  formatAskPdTime,
  type AskPdKind,
  type AskPdStatus,
} from "@/lib/supabase/ask-pd";
import { createAskPdRequest } from "./actions";

type RequestListRow = {
  id: string;
  kind: AskPdKind;
  status: AskPdStatus;
  user_unread: boolean;
  updated_at: string;
  ask_pd_messages: { body: string; created_at: string }[];
};

const ERRORS: Record<string, string> = {
  empty: "Please write your message before sending.",
  contact: "Choose how we should reach you and add your number or username.",
  failed: "Something went wrong sending that. Please try again.",
};

export default async function AskPdPage(props: PageProps<"/ask-pd">) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab === "call" ? "call" : "message";
  const fromCompanion = searchParams.from === "companion";
  const errorKey = typeof searchParams.error === "string" ? searchParams.error : null;

  const { supabase, user } = await requireUser();

  const [{ data: requests }, { count: companionCount }] = await Promise.all([
    supabase
      .from("ask_pd_requests")
      .select(
        "id, kind, status, user_unread, updated_at, ask_pd_messages(body, created_at)",
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .order("created_at", { referencedTable: "ask_pd_messages", ascending: false })
      .limit(1, { referencedTable: "ask_pd_messages" })
      .returns<RequestListRow[]>(),
    supabase
      .from("companion_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const hasCompanionHistory = (companionCount ?? 0) > 0;
  const tabHref = (t: "message" | "call") =>
    `/ask-pd?tab=${t}${fromCompanion ? "&from=companion" : ""}`;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-5 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink
        href={fromCompanion ? "/companion" : "/connect"}
        label={fromCompanion ? "Leap Companion" : "Connect"}
      />

      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-semibold">Ask PD</h1>
        <p className="text-sm text-muted-foreground">
          Reach Pastor Deniss and the Leap pastoral team directly. Real people,
          not AI. Send a private message or ask for a call, and we&apos;ll get
          back to you as soon as we can.
        </p>
        <p className="text-xs text-muted-foreground">
          Not for emergencies. If you&apos;re in danger, please{" "}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline"
          >
            find immediate help
          </a>
          .
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        {(
          [
            ["message", "Send a message", MessageSquareText],
            ["call", "Request a call", PhoneCall],
          ] as const
        ).map(([key, label, Icon]) => (
          <Link
            key={key}
            href={tabHref(key)}
            className={
              tab === key
                ? "flex items-center justify-center gap-1.5 rounded-lg bg-card py-2 text-sm font-semibold shadow-sm"
                : "flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-muted-foreground"
            }
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </div>

      {errorKey && ERRORS[errorKey] && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {ERRORS[errorKey]}
        </p>
      )}

      <form
        action={createAskPdRequest}
        className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm"
      >
        <input type="hidden" name="kind" value={tab} />

        {tab === "call" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="contact_method">How should we reach you?</Label>
              <select
                id="contact_method"
                name="contact_method"
                defaultValue="whatsapp"
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Phone call</option>
                <option value="video">Video call</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_detail">Your number or username</Label>
              <Input
                id="contact_detail"
                name="contact_detail"
                placeholder="e.g. +255 7XX XXX XXX"
                maxLength={200}
                required
                autoComplete="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preferred_time">Best time to call (optional)</Label>
              <Input
                id="preferred_time"
                name="preferred_time"
                placeholder="e.g. Weekday evenings after 6pm, EAT"
                maxLength={200}
              />
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="body">
            {tab === "call"
              ? "What would you like to talk about? (optional)"
              : "Your message"}
          </Label>
          <Textarea
            id="body"
            name="body"
            rows={5}
            maxLength={5000}
            required={tab === "message"}
            placeholder={
              tab === "call"
                ? "A sentence or two helps us prepare."
                : "Share what's on your heart: a question, a decision, something you'd like prayer or guidance for."
            }
          />
        </div>

        {hasCompanionHistory && (
          <label className="flex items-start gap-2.5 rounded-lg bg-muted/60 p-3 text-sm">
            <input
              type="checkbox"
              name="share_companion"
              className="mt-0.5 size-4 accent-[var(--primary)]"
            />
            <span>
              <span className="font-medium">
                Share my Leap Companion conversation
              </span>
              <span className="block text-xs text-muted-foreground">
                So the team can see what you&apos;ve been talking about. Only
                your most recent messages are shared, and only if you tick
                this.
              </span>
            </span>
          </label>
        )}

        <Button type="submit" className="w-full">
          {tab === "call" ? "Request a call" : "Send to Pastor Deniss"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Private: only Pastor Deniss and the Leap pastoral team can read this.
        </p>
      </form>

      {(requests ?? []).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your conversations
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {(requests ?? []).map((r) => (
              <Link
                key={r.id}
                href={`/ask-pd/${r.id}`}
                className="flex items-center gap-3 p-3 hover:bg-muted/50"
              >
                {r.user_unread ? (
                  <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="New reply" />
                ) : (
                  <span className="size-2 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {r.ask_pd_messages[0]?.body ?? "Conversation"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.kind === "call" ? "Call request · " : ""}
                    {r.user_unread ? "New reply" : askPdStatusLabel(r.status, "user")}
                    {" · "}
                    {formatAskPdTime(r.updated_at)}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
