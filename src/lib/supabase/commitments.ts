import type { SupabaseClient } from "@supabase/supabase-js";

export type Commitment = {
  id: string;
  body: string;
  status: "active" | "completed";
  week_of: string;
  created_at: string;
  completed_at: string | null;
};

// A user keeps at most one active commitment at a time — same "one thing at
// a time" posture as Formation Journeys — so this is the single row (if any)
// driving both the Commit tab and Home's commitment card.
export async function getActiveCommitment(
  supabase: SupabaseClient,
  userId: string,
): Promise<Commitment | null> {
  const { data, error } = await supabase
    .from("commitments")
    .select("id, body, status, week_of, created_at, completed_at")
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
    .select("id, body, status, week_of, created_at, completed_at")
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
