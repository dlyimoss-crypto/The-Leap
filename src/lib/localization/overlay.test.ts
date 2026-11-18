import { describe, expect, it } from "vitest";
import { overlayTranslation } from "./overlay";

const devotion = { id: "d1", title: "Grace", body: "English body", prayer: null as string | null, publish_date: "2026-11-18" };
const FIELDS = ["title", "body", "prayer"] as const;

describe("overlayTranslation", () => {
  it("returns the English source untouched for English readers", () => {
    const result = overlayTranslation(devotion, { title: "Gnade", body: "Text" }, FIELDS, "en");
    expect(result).toEqual({ ...devotion, servedLocale: "en" });
  });

  it("serves English, marked as such, when no published translation exists", () => {
    expect(overlayTranslation(devotion, null, FIELDS, "de")).toEqual({ ...devotion, servedLocale: "en" });
  });

  it("replaces only the translatable fields", () => {
    const result = overlayTranslation(devotion, { title: "Gnade", body: "Deutscher Text", prayer: null }, FIELDS, "de");
    expect(result).toEqual({
      id: "d1",
      title: "Gnade",
      body: "Deutscher Text",
      prayer: null,
      publish_date: "2026-11-18",
      servedLocale: "de",
    });
  });

  it("never leaves a field empty where the English has text", () => {
    const withPrayer = { ...devotion, prayer: "Lord, …" };
    const result = overlayTranslation(withPrayer, { title: "Gnade", body: "Text", prayer: null }, FIELDS, "de");
    // A translation missing a field is treated as not ready: whole item stays
    // in English rather than mixing languages inside one reading.
    expect(result).toEqual({ ...withPrayer, servedLocale: "en" });
  });

  it("keeps arrays (prayer points) from the translation", () => {
    const announcement = { title: "Pray", prayer_points: ["a", "b"] };
    const result = overlayTranslation(announcement, { title: "Ombi", prayer_points: ["x", "y"] }, ["title", "prayer_points"] as const, "sw");
    expect(result.prayer_points).toEqual(["x", "y"]);
    expect(result.servedLocale).toBe("sw");
  });

  it("treats a translation with fewer prayer points than the source as incomplete", () => {
    const announcement = { title: "Pray", prayer_points: ["a", "b"] };
    const result = overlayTranslation(announcement, { title: "Ombi", prayer_points: ["x"] }, ["title", "prayer_points"] as const, "sw");
    expect(result.servedLocale).toBe("en");
  });
});
