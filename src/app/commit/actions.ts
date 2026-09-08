"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/authorize";
import { COMMITMENT_BODY, COMMITMENT_ITEMS } from "@/lib/supabase/commitments";

export async function createCommitment() {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("commitments")
    .insert({ user_id: user.id, body: COMMITMENT_BODY });

  if (error) {
    console.error("Failed to create commitment", error);
  }

  revalidatePath("/commit");
  revalidatePath("/");
}

const ITEM_KEYS = COMMITMENT_ITEMS.map((item) => item.key);
type CommitmentItemKey = (typeof ITEM_KEYS)[number];

function isCommitmentItemKey(value: string): value is CommitmentItemKey {
  return (ITEM_KEYS as string[]).includes(value);
}

export async function toggleCommitmentItem(
  id: string,
  key: CommitmentItemKey,
  nextValue: boolean,
) {
  if (!isCommitmentItemKey(key)) {
    return;
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("commitments")
    .update({ [key]: nextValue })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    console.error("Failed to update commitment item", error);
  }

  revalidatePath("/commit");
  revalidatePath("/");
}

// The WHERE clause re-checks all three items server-side — the UI already
// disables this button until they're all ticked, but a client can't be
// trusted to enforce that on its own.
export async function completeCommitment(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("commitments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("scripture_done", true)
    .eq("prayer_done", true)
    .eq("witness_done", true);

  if (error) {
    console.error("Failed to complete commitment", error);
  }

  revalidatePath("/commit");
  revalidatePath("/");
}
