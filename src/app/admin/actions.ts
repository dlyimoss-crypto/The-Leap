"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { parsePriceCents } from "@/lib/book-price";
import { requireAdmin } from "@/lib/supabase/authorize";
import {
  ANNOUNCEMENT_IMAGE_BUCKET,
  isAnnouncementKind,
  sanitizeAnnouncementLink,
} from "@/lib/supabase/announcements";

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
    practice: String(formData.get("practice") ?? "").trim() || null,
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

// Fields shared by every announcement kind, plus the kind-specific ones
// (scripture/prayer points for Prayer, a date for Event). Fields that don't
// belong to the chosen kind are cleared, so switching an announcement from
// Prayer to News doesn't leave hidden prayer points behind.
function announcementFields(formData: FormData) {
  const kindRaw = formData.get("kind");
  const kind = isAnnouncementKind(kindRaw) ? kindRaw : "prayer";

  const prayer_points =
    kind === "prayer"
      ? String(formData.get("prayer_points") ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  const eventDate = String(formData.get("event_date") ?? "").trim();

  return {
    kind,
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim() || null,
    link_url: sanitizeAnnouncementLink(String(formData.get("link_url") ?? "")),
    link_label: String(formData.get("link_label") ?? "").trim() || null,
    event_date:
      kind === "event" && /^\d{4}-\d{2}-\d{2}$/.test(eventDate)
        ? eventDate
        : null,
    scripture_reference:
      kind === "prayer"
        ? String(formData.get("scripture_reference") ?? "").trim() || null
        : null,
    prayer_points,
  };
}

// Uploads a newly chosen image (if any). Returns the new storage path, null
// to clear the image ("remove image" ticked), or undefined to leave the
// existing image as it is.
async function announcementImageUpdate(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  formData: FormData,
): Promise<string | null | undefined> {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from(ANNOUNCEMENT_IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type || undefined });
    if (error) {
      console.error("Failed to upload announcement image", error);
      return undefined;
    }
    return path;
  }
  return formData.get("remove_image") === "on" ? null : undefined;
}

function revalidateAnnouncement() {
  revalidatePath("/admin");
  revalidatePath("/prayer-room");
  revalidatePath("/");
  revalidateTag("announcement", { expire: 0 });
}

export async function createAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();

  const image_path = await announcementImageUpdate(supabase, formData);

  const { error } = await supabase
    .from("prayer_movements")
    .insert({ ...announcementFields(formData), image_path: image_path ?? null });

  if (error) {
    console.error("Failed to create announcement", error);
  }

  revalidateAnnouncement();
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const image_path = await announcementImageUpdate(supabase, formData);

  const { error } = await supabase
    .from("prayer_movements")
    .update({
      ...announcementFields(formData),
      ...(image_path !== undefined ? { image_path } : {}),
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update announcement", error);
  }

  revalidateAnnouncement();
}

// Only one announcement is featured at a time, so activating one archives
// whichever was previously active first.
export async function activateAnnouncement(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const daysRaw = Number.parseInt(String(formData.get("days") ?? ""), 10);
  const days = Number.isFinite(daysRaw) && daysRaw > 0 ? daysRaw : 7;
  const activeUntil = new Date();
  activeUntil.setDate(activeUntil.getDate() + (days - 1));
  const activeUntilStr = activeUntil.toISOString().slice(0, 10);

  const { error: archiveError } = await supabase
    .from("prayer_movements")
    .update({ status: "archived" })
    .eq("status", "active");

  if (archiveError) {
    console.error("Failed to archive previous announcement", archiveError);
  }

  const { error } = await supabase
    .from("prayer_movements")
    .update({ status: "active", active_until: activeUntilStr })
    .eq("id", id);

  if (error) {
    console.error("Failed to activate announcement", error);
  }

  revalidateAnnouncement();
}

export async function archiveAnnouncement(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("prayer_movements")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) {
    console.error("Failed to archive announcement", error);
  }

  revalidateAnnouncement();
}

export async function deleteAnnouncement(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("prayer_movements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete announcement", error);
  }

  revalidateAnnouncement();
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

export async function updateBookPrice(bookId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const priceCents = parsePriceCents(String(formData.get("price_usd") ?? ""));

  const { error } = await supabase
    .from("books")
    .update({ price_cents: priceCents })
    .eq("id", bookId);

  if (error) {
    console.error("Failed to update book price", error);
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

function serviceOpportunityFields(formData: FormData) {
  const status = String(formData.get("status") ?? "draft");

  return {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    contact_email: String(formData.get("contact_email") ?? "").trim() || null,
    contact_phone: String(formData.get("contact_phone") ?? "").trim() || null,
    link: String(formData.get("link") ?? "").trim() || null,
    status: status === "published" ? "published" : "draft",
  };
}

export async function createServiceOpportunity(formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("service_opportunities")
    .insert(serviceOpportunityFields(formData));

  if (error) {
    console.error("Failed to create service opportunity", error);
  }

  revalidatePath("/admin");
}

export async function updateServiceOpportunity(
  id: string,
  formData: FormData,
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("service_opportunities")
    .update(serviceOpportunityFields(formData))
    .eq("id", id);

  if (error) {
    console.error("Failed to update service opportunity", error);
  }

  revalidatePath("/admin");
}

export async function deleteServiceOpportunity(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("service_opportunities")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete service opportunity", error);
  }

  revalidatePath("/admin");
}
