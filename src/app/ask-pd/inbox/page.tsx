import Link from "next/link";
import { ChevronRight, Inbox, PhoneCall } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requirePdTeam } from "@/lib/supabase/authorize";
import {
  askPdStatusLabel,
  formatAskPdTime,
  type AskPdKind,
  type AskPdStatus,
} from "@/lib/supabase/ask-pd";

type InboxRow = {
  id: string;
  kind: AskPdKind;
  status: AskPdStatus;
  team_unread: boolean;
  updated_at: string;
  requester: { display_name: string | null } | null;
  ask_pd_messages: { body: string; from_team: boolean }[];
};

const FILTERS = [
  { key: "open", label: "Needs a reply", statuses: ["open"] },
  { key: "answered", label: "Answered", statuses: ["answered"] },
  { key: "closed", label: "Closed", statuses: ["closed"] },
] as const;

// The PD team's shared inbox: every Ask PD message and call request.
export default async function AskPdInboxPage(
  props: PageProps<"/ask-pd/inbox">,
) {
  const searchParams = await props.searchParams;
  const filter =
    FILTERS.find((f) => f.key === searchParams.status) ?? FILTERS[0];

  const { supabase } = await requirePdTeam();

  const [{ data: rows, error }, ...counts] = await Promise.all([
    supabase
      .from("ask_pd_requests")
      .select(
        "id, kind, status, team_unread, updated_at, requester:profiles!ask_pd_requests_user_id_fkey(display_name), ask_pd_messages(body, from_team)",
      )
      .in("status", [...filter.statuses])
      .order("updated_at", { ascending: false })
      .order("created_at", { referencedTable: "ask_pd_messages", ascending: false })
      .limit(1, { referencedTable: "ask_pd_messages" })
      .returns<InboxRow[]>(),
    ...FILTERS.map((f) =>
      supabase
        .from("ask_pd_requests")
        .select("id", { count: "exact", head: true })
        .in("status", [...f.statuses]),
    ),
  ]);

  if (error) {
    console.error("Failed to load Ask PD inbox", error);
  }

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/" label="Home" />
      <div>
        <h1 className="text-2xl font-heading font-semibold">Ask PD inbox</h1>
        <p className="text-sm text-muted-foreground">
          Messages and call requests for Pastor Deniss and the team.
        </p>
      </div>

      <div className="flex gap-4 border-b">
        {FILTERS.map((f, i) => (
          <Link
            key={f.key}
            href={`/ask-pd/inbox?status=${f.key}`}
            className={
              f.key === filter.key
                ? "-mb-px border-b-2 border-primary pb-2 text-sm font-semibold text-primary"
                : "pb-2 text-sm font-medium text-muted-foreground"
            }
          >
            {f.label} ({counts[i]?.count ?? 0})
          </Link>
        ))}
      </div>

      {(rows ?? []).length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Inbox className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Nothing here.</p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {(rows ?? []).map((r) => (
            <Link
              key={r.id}
              href={`/ask-pd/inbox/${r.id}`}
              className="flex items-center gap-3 p-3 hover:bg-muted/50"
            >
              {r.team_unread ? (
                <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
              ) : (
                <span className="size-2 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  {r.kind === "call" && <PhoneCall className="size-3.5 text-primary" />}
                  {r.requester?.display_name || "Unnamed user"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {r.ask_pd_messages[0]?.from_team ? "You: " : ""}
                  {r.ask_pd_messages[0]?.body ?? ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {askPdStatusLabel(r.status, "team")} · {formatAskPdTime(r.updated_at)}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
