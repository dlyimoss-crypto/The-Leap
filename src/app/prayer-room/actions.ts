"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkForCrisisLanguage } from "@/lib/crisis-detection";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return { supabase, user };
}

export async function postPrayerRequest(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  const visibility = formData.get("visibility") === "private" ? "private" : "public";
  const isAnonymous = formData.get("isAnonymous") === "true";

  if (!body) {
    redirect("/prayer-room");
  }

  const { supabase, user } = await requireUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_banned")
    .eq("id", user.id)
    .single();

  // Fail closed: if we can't confirm the user isn't banned, don't post.
  if (profileError || profile?.is_banned) {
    redirect("/prayer-room");
  }

  const { data: inserted, error } = await supabase
    .from("prayer_requests")
    .insert({
      user_id: user.id,
      body,
      visibility,
      is_anonymous: isAnonymous,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("Failed to post prayer request", error);
    redirect("/prayer-room");
  }

  const crisisCheck = checkForCrisisLanguage(body);
  if (crisisCheck.flagged) {
    const { error: reportError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      target_type: "prayer_request",
      target_id: inserted.id,
      reason: "auto_crisis_detection",
    });

    if (reportError) {
      console.error("Failed to auto-file crisis report", reportError);
    }

    redirect("/prayer-room?crisis=1");
  }

  redirect("/prayer-room");
}

export async function prayForRequest(prayerRequestId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("prayer_responses").upsert(
    { prayer_request_id: prayerRequestId, user_id: user.id },
    { onConflict: "prayer_request_id,user_id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("Failed to record prayer response", error);
  }

  revalidatePath("/prayer-room");
}

export async function markAnswered(prayerRequestId: string, formData: FormData) {
  const testimony = String(formData.get("testimony") ?? "").trim();
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("prayer_requests")
    .update({ status: "answered", testimony: testimony || null })
    .eq("id", prayerRequestId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to mark prayer request answered", error);
  }

  revalidatePath("/prayer-room");
}

export async function reportPrayerRequest(prayerRequestId: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase.rpc("report_content", {
    p_target_type: "prayer_request",
    p_target_id: prayerRequestId,
    p_reason: "user_reported",
  });

  if (error) {
    console.error("Failed to report prayer request", error);
  }

  revalidatePath("/prayer-room");
}
