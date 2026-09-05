export type DevotionStatus = "draft" | "scheduled" | "published";

// publish_date alone drives status — no stored status column, since nothing
// in this app runs a scheduled job that could flip it once the date arrives.
export function getDevotionStatus(
  publishDate: string | null,
  today: Date = new Date(),
): DevotionStatus {
  if (!publishDate) {
    return "draft";
  }
  const todayStr = today.toISOString().slice(0, 10);
  return publishDate <= todayStr ? "published" : "scheduled";
}
