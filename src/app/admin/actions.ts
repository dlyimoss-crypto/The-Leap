"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/authorize";

const RESTORED_STATUS_BY_TYPE: Record<string, string> = {
  post: "visible",
  comment: "visible",
  prayer_request: "open",
};

const TABLE_BY_TYPE: Record<string, string> = {
  post: "posts",
  comment: "comments",
  prayer_request: "prayer_requests",
};

export async function resolveReport(
  reportId: string,
  targetType: string,
  targetId: string,
  resolution: "restored" | "removed",
) {
  const { supabase } = await requireAdmin();

  const table = TABLE_BY_TYPE[targetType];
  const newStatus =
    resolution === "restored" ? RESTORED_STATUS_BY_TYPE[targetType] : "removed";

  if (table && newStatus) {
    const { error: statusError } = await supabase
      .from(table)
      .update({ status: newStatus })
      .eq("id", targetId);

    if (statusError) {
      console.error("Failed to update content status", statusError);
    }
  }

  const { error } = await supabase
    .from("reports")
    .update({ status: "resolved", resolution })
    .eq("id", reportId);

  if (error) {
    console.error("Failed to resolve report", error);
  }

  revalidatePath("/admin");
}

export async function banUser(userId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.rpc("set_user_banned", {
    p_user_id: userId,
    p_is_banned: true,
  });

  if (error) {
    console.error("Failed to ban user", error);
  }

  revalidatePath("/admin");
}

export async function unbanUser(userId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.rpc("set_user_banned", {
    p_user_id: userId,
    p_is_banned: false,
  });

  if (error) {
    console.error("Failed to unban user", error);
  }

  revalidatePath("/admin");
}

function devotionFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    scripture_reference:
      String(formData.get("scripture_reference") ?? "").trim() || null,
    body: String(formData.get("body") ?? "").trim(),
    reflection: String(formData.get("reflection") ?? "").trim() || null,
    prayer: String(formData.get("prayer") ?? "").trim() || null,
    publish_date: String(formData.get("publish_date") ?? "").trim() || null,
  };
}

export async function createDevotion(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("devotions")
    .insert({ ...devotionFields(formData), author_id: user.id });

  if (error) {
    console.error("Failed to create devotion", error);
  }

  revalidatePath("/admin");
}

export async function updateDevotion(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("devotions")
    .update(devotionFields(formData))
    .eq("id", id);

  if (error) {
    console.error("Failed to update devotion", error);
  }

  revalidatePath("/admin");
}

export async function deleteDevotion(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("devotions").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete devotion", error);
  }

  revalidatePath("/admin");
}

export async function approveAuthorApplication(
  applicationId: string,
  userId: string,
) {
  const { supabase } = await requireAdmin();

  const { error: appError } = await supabase
    .from("author_applications")
    .update({ status: "approved", review_notes: null })
    .eq("id", applicationId);

  if (appError) {
    console.error("Failed to approve author application", appError);
  }

  const { error: rpcError } = await supabase.rpc("set_user_author", {
    p_user_id: userId,
    p_is_author: true,
  });

  if (rpcError) {
    console.error("Failed to grant author status", rpcError);
  }

  revalidatePath("/admin");
}

export async function rejectAuthorApplication(
  applicationId: string,
  formData: FormData,
) {
  const { supabase } = await requireAdmin();

  const reviewNotes = String(formData.get("review_notes") ?? "").trim() || null;

  const { error } = await supabase
    .from("author_applications")
    .update({ status: "rejected", review_notes: reviewNotes })
    .eq("id", applicationId);

  if (error) {
    console.error("Failed to reject author application", error);
  }

  revalidatePath("/admin");
}

export async function requestAuthorInfo(
  applicationId: string,
  formData: FormData,
) {
  const { supabase } = await requireAdmin();

  const reviewNotes = String(formData.get("review_notes") ?? "").trim() || null;

  const { error } = await supabase
    .from("author_applications")
    .update({ status: "more_info_requested", review_notes: reviewNotes })
    .eq("id", applicationId);

  if (error) {
    console.error("Failed to request more author info", error);
  }

  revalidatePath("/admin");
}

export async function requestBookChanges(bookId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const reviewNotes = String(formData.get("review_notes") ?? "").trim() || null;

  const { error } = await supabase
    .from("books")
    .update({ status: "changes_requested", review_notes: reviewNotes })
    .eq("id", bookId);

  if (error) {
    console.error("Failed to request book changes", error);
  }

  revalidatePath("/admin");
}

export async function rejectBook(bookId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const reviewNotes = String(formData.get("review_notes") ?? "").trim() || null;

  const { error } = await supabase
    .from("books")
    .update({ status: "rejected", review_notes: reviewNotes })
    .eq("id", bookId);

  if (error) {
    console.error("Failed to reject book", error);
  }

  revalidatePath("/admin");
}

export async function approveBook(bookId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("books")
    .update({ status: "approved", review_notes: null })
    .eq("id", bookId);

  if (error) {
    console.error("Failed to approve book", error);
  }

  revalidatePath("/admin");
}

export async function publishBook(bookId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("books")
    .update({ status: "published" })
    .eq("id", bookId);

  if (error) {
    console.error("Failed to publish book", error);
  }

  revalidatePath("/admin");
}

export async function unpublishBook(bookId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("books")
    .update({ status: "unpublished" })
    .eq("id", bookId);

  if (error) {
    console.error("Failed to unpublish book", error);
  }

  revalidatePath("/admin");
}

function churchFields(formData: FormData) {
  const memberCountRaw = String(
    formData.get("member_count_estimate") ?? "",
  ).trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    lead_pastor: String(formData.get("lead_pastor") ?? "").trim() || null,
    mission: String(formData.get("mission") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    service_time: String(formData.get("service_time") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    member_count_estimate: memberCountRaw
      ? Number.parseInt(memberCountRaw, 10)
      : null,
  };
}

export async function createChurch(formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("churches").insert(churchFields(formData));

  if (error) {
    console.error("Failed to create church", error);
  }

  revalidatePath("/admin");
}

export async function updateChurch(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("churches")
    .update(churchFields(formData))
    .eq("id", id);

  if (error) {
    console.error("Failed to update church", error);
  }

  revalidatePath("/admin");
}

export async function deleteChurch(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("churches").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete church", error);
  }

  revalidatePath("/admin");
}
