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
