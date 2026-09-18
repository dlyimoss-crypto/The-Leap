import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The three "needs admin attention" counts already surfaced as per-tab
 * badges on /admin (moderation queue, author applications, book review
 * queue). Pulled into one place so the bottom-nav badge and the admin
 * page's own tab badges can't drift apart.
 */
export type AdminNotificationCounts = {
  openReportsCount: number;
  pendingApplicationsCount: number;
  pendingBooksCount: number;
};

export async function getAdminNotificationCounts(
  supabase: SupabaseClient,
): Promise<AdminNotificationCounts> {
  const [
    { count: openReportsCount },
    { count: pendingApplicationsCount },
    { count: pendingBooksCount },
  ] = await Promise.all([
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("author_applications")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "more_info_requested"]),
    supabase
      .from("books")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_review"),
  ]);

  return {
    openReportsCount: openReportsCount ?? 0,
    pendingApplicationsCount: pendingApplicationsCount ?? 0,
    pendingBooksCount: pendingBooksCount ?? 0,
  };
}

export function totalAdminNotificationCount(counts: AdminNotificationCounts) {
  return (
    counts.openReportsCount +
    counts.pendingApplicationsCount +
    counts.pendingBooksCount
  );
}
