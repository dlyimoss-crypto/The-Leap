import type { ItemState } from "@/lib/localization/admin-data";

export function stateBadgeVariant(
  state: ItemState,
): "default" | "secondary" | "outline" | "destructive" {
  if (state === "published") return "default";
  if (state === "needs_revision") return "destructive";
  if (state === "missing") return "outline";
  return "secondary";
}

const SINGLE_LINE = new Set(["title", "completion_title", "link_label"]);

/** Whether a translation field gets a textarea (vs a one-line input). */
export function isMultiline(field: string) {
  return !SINGLE_LINE.has(field);
}
