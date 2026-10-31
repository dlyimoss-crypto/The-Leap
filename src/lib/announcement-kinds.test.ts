import { describe, expect, test } from "vitest";
import { isAnnouncementKind, sanitizeAnnouncementLink } from "./announcement-kinds";

describe("sanitizeAnnouncementLink", () => {
  test("keeps https and http links", () => {
    expect(sanitizeAnnouncementLink("https://leapgrow.app/give")).toBe(
      "https://leapgrow.app/give",
    );
    expect(sanitizeAnnouncementLink(" http://example.com ")).toBe(
      "http://example.com/",
    );
  });

  test("keeps in-app paths", () => {
    expect(sanitizeAnnouncementLink("/evolve/books")).toBe("/evolve/books");
  });

  test("rejects other schemes, protocol-relative links and junk", () => {
    expect(sanitizeAnnouncementLink("javascript:alert(1)")).toBeNull();
    expect(sanitizeAnnouncementLink("data:text/html,hi")).toBeNull();
    expect(sanitizeAnnouncementLink("//evil.example")).toBeNull();
    expect(sanitizeAnnouncementLink("not a url")).toBeNull();
    expect(sanitizeAnnouncementLink("   ")).toBeNull();
  });
});

describe("isAnnouncementKind", () => {
  test("accepts known kinds only", () => {
    expect(isAnnouncementKind("event")).toBe(true);
    expect(isAnnouncementKind("party")).toBe(false);
    expect(isAnnouncementKind(null)).toBe(false);
  });
});
