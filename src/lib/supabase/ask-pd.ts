import type { SupabaseClient } from "@supabase/supabase-js";

// Ask PD: a user reaching Pastor Deniss (PD) and the PD team directly,
// by private message or by requesting a call. See migration 0037.

export type AskPdKind = "message" | "call";
export type AskPdStatus = "open" | "answered" | "closed";
export type ContactMethod = "whatsapp" | "phone" | "video";

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  whatsapp: "WhatsApp",
  phone: "Phone call",
  video: "Video call",
};

export function isContactMethod(value: unknown): value is ContactMethod {
  return value === "whatsapp" || value === "phone" || value === "video";
}

export type CompanionSnapshotMessage = {
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type AskPdRequest = {
  id: string;
  user_id: string;
  kind: AskPdKind;
  status: AskPdStatus;
  contact_method: ContactMethod | null;
  contact_detail: string | null;
  preferred_time: string | null;
  companion_snapshot: CompanionSnapshotMessage[] | null;
  user_unread: boolean;
  team_unread: boolean;
  created_at: string;
  updated_at: string;
};

export type AskPdMessage = {
  id: string;
  request_id: string;
  author_id: string | null;
  from_team: boolean;
  body: string;
  created_at: string;
  author: { display_name: string | null } | null;
};

export const ASK_PD_REQUEST_COLUMNS =
  "id, user_id, kind, status, contact_method, contact_detail, preferred_time, companion_snapshot, user_unread, team_unread, created_at, updated_at";

export const ASK_PD_MESSAGE_COLUMNS =
  "id, request_id, author_id, from_team, body, created_at, author:profiles!ask_pd_messages_author_id_fkey(display_name)";

// How many of a user's Companion messages to attach when they choose to
// share: enough for context, not their whole history.
export const COMPANION_SNAPSHOT_LIMIT = 20;

export async function countUserUnreadAskPd(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count } = await supabase
    .from("ask_pd_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("user_unread", true);
  return count ?? 0;
}

/** Requests waiting on the PD team: new, or with an unanswered follow-up. */
export async function countTeamUnreadAskPd(
  supabase: SupabaseClient,
): Promise<number> {
  const { count } = await supabase
    .from("ask_pd_requests")
    .select("id", { count: "exact", head: true })
    .eq("team_unread", true)
    .neq("status", "closed");
  return count ?? 0;
}

export async function getAskPdThread(
  supabase: SupabaseClient,
  requestId: string,
): Promise<{ request: AskPdRequest; messages: AskPdMessage[] } | null> {
  const [{ data: request }, { data: messages }] = await Promise.all([
    supabase
      .from("ask_pd_requests")
      .select(ASK_PD_REQUEST_COLUMNS)
      .eq("id", requestId)
      .maybeSingle<AskPdRequest>(),
    supabase
      .from("ask_pd_messages")
      .select(ASK_PD_MESSAGE_COLUMNS)
      .eq("request_id", requestId)
      .order("created_at", { ascending: true })
      .returns<AskPdMessage[]>(),
  ]);

  if (!request) {
    return null;
  }
  return { request, messages: messages ?? [] };
}

export function askPdStatusLabel(
  status: AskPdStatus,
  audience: "user" | "team",
): string {
  if (status === "closed") return "Closed";
  if (status === "answered") return audience === "user" ? "Replied" : "Answered";
  return audience === "user" ? "Waiting for a reply" : "Needs a reply";
}

export function formatAskPdTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
