import { describe, expect, test } from "vitest";
import { getCommunityPrompt } from "./community-prompt";

describe("getCommunityPrompt", () => {
  test("returns the authored prompt for a date that has one", () => {
    expect(getCommunityPrompt("2026-09-01")).toBe(
      "What has God been teaching you this week?",
    );
  });

  test("returns null for a date with no authored prompt", () => {
    expect(getCommunityPrompt("2099-01-01")).toBeNull();
  });

  test("returns null for a malformed date rather than touching the filesystem unsafely", () => {
    expect(getCommunityPrompt("../../../../etc/passwd")).toBeNull();
  });
});
