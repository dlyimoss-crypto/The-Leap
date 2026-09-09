"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/authorize";

// Records that this user has seen (and passed on) the invitation, for the
// admin "responded" analytics — the card itself now pops up on every app
// open regardless of this timestamp; it's tracking only, not a gate.
// Called on "Maybe Later" and implicitly by recordGospelPrayer below.
export async function dismissGospelInvite() {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("profiles")
    .update({ gospel_invite_shown_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to dismiss gospel invite", error);
  }

  revalidatePath("/");
}

// A self-reported "I prayed this prayer" — recorded for pastoral
// visibility only. The app has no way to know, and never claims, whether
// someone is actually saved.
export async function recordGospelPrayer() {
  const { supabase, user } = await requireUser();

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("profiles")
    .update({ gospel_invite_shown_at: now, gospel_prayer_at: now })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to record gospel prayer", error);
  }

  revalidatePath("/");
}
