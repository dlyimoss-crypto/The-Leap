import { describe, expect, test } from "vitest";
import { getDevotionStatus } from "./devotion";

describe("getDevotionStatus", () => {
  test("returns draft when publish_date is null", () => {
    expect(getDevotionStatus(null)).toBe("draft");
  });

  test("returns scheduled when publish_date is in the future", () => {
    const today = new Date("2026-09-05T00:00:00Z");
    expect(getDevotionStatus("2026-09-06", today)).toBe("scheduled");
  });

  test("returns published when publish_date is today", () => {
    const today = new Date("2026-09-05T00:00:00Z");
    expect(getDevotionStatus("2026-09-05", today)).toBe("published");
  });

  test("returns published when publish_date is in the past", () => {
    const today = new Date("2026-09-05T00:00:00Z");
    expect(getDevotionStatus("2026-09-01", today)).toBe("published");
  });
});
