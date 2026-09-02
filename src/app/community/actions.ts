"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActiveUser, requireUser } from "@/lib/supabase/authorize";
import { checkForCrisisLanguage } from "@/lib/crisis-detection";

export async function createPost(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    redirect("/community");
  }

  const { supabase, user } = await requireActiveUser("/community");

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, body })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("Failed to create post", error);
    redirect("/community");
  }

  const crisisCheck = checkForCrisisLanguage(body);
  if (crisisCheck.flagged) {
    const { error: reportError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      target_type: "post",
      target_id: inserted.id,
      reason: "auto_crisis_detection",
    });

    if (reportError) {
      console.error("Failed to auto-file crisis report", reportError);
    }

    redirect("/community?crisis=1");
  }

  redirect("/community");
}

export async function toggleReaction(
  postId: string,
  type: "encourage" | "pray",
) {
  const { supabase, user } = await requireUser();

  const { data: existing } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .eq("type", type)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("reactions").delete().eq("id", existing.id)
    : await supabase.from("reactions").upsert(
        { post_id: postId, user_id: user.id, type },
        { onConflict: "post_id,user_id,type", ignoreDuplicates: true },
      );

  if (error) {
    console.error("Failed to toggle reaction", error);
  }

  revalidatePath("/community");
}

export async function addComment(postId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    redirect(`/community/${postId}`);
  }

  const { supabase, user } = await requireActiveUser(`/community/${postId}`);

  const { data: inserted, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: user.id, body })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("Failed to add comment", error);
    redirect(`/community/${postId}`);
  }

  // Same safety net as posts/prayer requests (ticket 08's shared
  // crisis-detection module) — a comment is public content too.
  const crisisCheck = checkForCrisisLanguage(body);
  if (crisisCheck.flagged) {
    const { error: reportError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      target_type: "comment",
      target_id: inserted.id,
      reason: "auto_crisis_detection",
    });

    if (reportError) {
      console.error("Failed to auto-file crisis report", reportError);
    }

    revalidatePath(`/community/${postId}`);
    redirect(`/community/${postId}?crisis=1`);
  }

  revalidatePath(`/community/${postId}`);
  redirect(`/community/${postId}`);
}

export async function reportPost(postId: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase.rpc("report_content", {
    p_target_type: "post",
    p_target_id: postId,
    p_reason: "user_reported",
  });

  if (error) {
    console.error("Failed to report post", error);
  }

  revalidatePath("/community");
}

export async function blockUser(blockedId: string) {
  const { supabase, user } = await requireUser();

  if (blockedId === user.id) {
    redirect("/community");
  }

  const { error } = await supabase.from("blocks").upsert(
    { blocker_id: user.id, blocked_id: blockedId },
    { onConflict: "blocker_id,blocked_id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("Failed to block user", error);
  }

  revalidatePath("/community");
}
