import fs from "node:fs";
import path from "node:path";
import { describe, expect, test, vi } from "vitest";
import { getCommunityPrompt } from "./community-prompt";

describe("getCommunityPrompt", () => {
  test("returns the authored prompt for a date that has one", () => {
    expect(getCommunityPrompt("2026-09-01")).toEqual({
      prompt: "What has God been teaching you this week?",
      servedLocale: "en",
    });
  });

  test("returns the prompt in the reader's language when translated", () => {
    expect(getCommunityPrompt("2026-09-01", "de")).toEqual({
      prompt: "Was hat Gott dich diese Woche gelehrt?",
      servedLocale: "de",
    });
  });

  test("falls back to English when the language has no file for that date", () => {
    const realExists = fs.existsSync;
    const spy = vi
      .spyOn(fs, "existsSync")
      .mockImplementation((p) =>
        String(p).includes(`${path.sep}de${path.sep}`) ? false : realExists(p),
      );
    try {
      expect(getCommunityPrompt("2026-09-01", "de")).toEqual({
        prompt: "What has God been teaching you this week?",
        servedLocale: "en",
      });
    } finally {
      spy.mockRestore();
    }
  });

  test("returns null for a date with no authored prompt", () => {
    expect(getCommunityPrompt("2099-01-01", "fr")).toBeNull();
  });

  test("returns null for a malformed date rather than touching the filesystem unsafely", () => {
    expect(getCommunityPrompt("../../../../etc/passwd", "de")).toBeNull();
  });
});
