import type { SupabaseClient } from "@supabase/supabase-js";

export type Commitment = {
  id: string;
  body: string;
  status: "active" | "completed";
  week_of: string;
  created_at: string;
  completed_at: string | null;
  scripture_done: boolean;
  prayer_done: boolean;
  witness_done: boolean;
};

// The fixed practices every weekly commitment is made of. "key" names the
// boolean column each checkbox toggles; the sentence they spell out
// together becomes the commitment's stored `body`.
export const COMMITMENT_ITEMS = [
  {
    key: "scripture_done",
    label: "Study 5 paragraphs of the Bible",
    detail: "Every day this week",
    sentence: "study 5 paragraphs of the Bible every day",
  },
  {
    key: "prayer_done",
    label: "Pray for 5–15 minutes",
    detail: "Every day this week",
    sentence: "pray for 5–15 minutes every day",
  },
  {
    key: "witness_done",
    label: "Share the gospel",
    detail: "At least once this week",
    sentence: "share the gospel at least once",
  },
] as const satisfies ReadonlyArray<{
  key: "scripture_done" | "prayer_done" | "witness_done";
  label: string;
  detail: string;
  sentence: string;
}>;

export const COMMITMENT_BODY = `I will ${COMMITMENT_ITEMS.map((i) => i.sentence).join(", ")}.`;

export function commitmentItemsDone(commitment: Commitment) {
  return COMMITMENT_ITEMS.filter((item) => commitment[item.key]).length;
}

// A user keeps at most one active commitment at a time — same "one thing at
// a time" posture as Formation Journeys — so this is the single row (if any)
// driving both the Commit tab and Home's commitment card.
export async function getActiveCommitment(
  supabase: SupabaseClient,
  userId: string,
): Promise<Commitment | null> {
  const { data, error } = await supabase
    .from("commitments")
    .select("id, body, status, week_of, created_at, completed_at, scripture_done, prayer_done, witness_done")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Commitment>();

  if (error) {
    console.error("Failed to load active commitment", error);
  }

  return data ?? null;
}

export async function getCommitmentHistory(
  supabase: SupabaseClient,
  userId: string,
): Promise<Commitment[]> {
  const { data, error } = await supabase
    .from("commitments")
    .select("id, body, status, week_of, created_at, completed_at, scripture_done, prayer_done, witness_done")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(10)
    .returns<Commitment[]>();

  if (error) {
    console.error("Failed to load commitment history", error);
  }

  return data ?? [];
}
