import { describe, expect, it } from "vitest";
import { formatDate, interpolate, plural } from "./format";

describe("interpolate", () => {
  it("fills named placeholders and leaves unknown ones", () => {
    expect(interpolate("Day {n} of {total} {x}", { n: 2, total: 7 })).toBe("Day 2 of 7 {x}");
  });
});

describe("plural", () => {
  const days = { one: "{count} day left", other: "{count} days left" };

  it("uses the singular form for 1 in English", () => {
    expect(plural("en", 1, days)).toBe("1 day left");
    expect(plural("en", 3, days)).toBe("3 days left");
    expect(plural("en", 0, days)).toBe("0 days left");
  });

  it("falls back to `other` for languages without a `one` form", () => {
    expect(plural("zh-CN", 1, { other: "剩余{count}天" })).toBe("剩余1天");
  });

  it("formats the count for the locale", () => {
    expect(plural("de", 1200, { one: "{count} Tag", other: "{count} Tage" })).toBe("1.200 Tage");
  });

  it("accepts extra values", () => {
    expect(plural("en", 2, { other: "{count} of {total}" }, { total: 5 })).toBe("2 of 5");
  });
});

describe("formatDate", () => {
  it("treats YYYY-MM-DD as a local calendar date", () => {
    expect(formatDate("en-US", "2026-11-18", { month: "long", day: "numeric" })).toBe("November 18");
  });

  it("localizes month names", () => {
    expect(formatDate("de", "2026-03-05", { month: "long" })).toBe("März");
  });
});
