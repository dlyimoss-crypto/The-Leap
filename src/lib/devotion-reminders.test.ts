import { describe, expect, it } from "vitest";
import { reminderDueOn } from "./devotion-reminders";

const at = (iso: string) => new Date(iso);

describe("reminderDueOn", () => {
  const sub = { remind_hour: 7, time_zone: "UTC", last_sent_on: null };

  it("is due at the chosen hour", () => {
    expect(reminderDueOn(sub, at("2026-10-17T07:00:00Z"))).toBe("2026-10-17");
  });

  it("is not due before the chosen hour", () => {
    expect(reminderDueOn(sub, at("2026-10-17T06:59:00Z"))).toBeNull();
  });

  it("catches up a missed run within a few hours", () => {
    expect(reminderDueOn(sub, at("2026-10-17T09:30:00Z"))).toBe("2026-10-17");
  });

  it("does not fire long after the chosen hour", () => {
    expect(reminderDueOn(sub, at("2026-10-17T21:00:00Z"))).toBeNull();
  });

  it("sends at most once per local day", () => {
    expect(
      reminderDueOn(
        { ...sub, last_sent_on: "2026-10-17" },
        at("2026-10-17T08:00:00Z"),
      ),
    ).toBeNull();
  });

  it("uses the device's own time zone", () => {
    // 04:00 UTC is 07:00 in Dar es Salaam (UTC+3).
    const dar = { ...sub, time_zone: "Africa/Dar_es_Salaam" };
    expect(reminderDueOn(dar, at("2026-10-17T04:00:00Z"))).toBe("2026-10-17");
    expect(reminderDueOn(dar, at("2026-10-17T07:00:00Z"))).toBeNull();
  });

  it("reports the local date, not the UTC date", () => {
    // 22:30 UTC on the 16th is 07:30 on the 17th in Tokyo.
    const tokyo = { ...sub, time_zone: "Asia/Tokyo" };
    expect(reminderDueOn(tokyo, at("2026-10-16T22:30:00Z"))).toBe(
      "2026-10-17",
    );
  });

  it("falls back to UTC for an unknown time zone", () => {
    const bad = { ...sub, time_zone: "Not/AZone" };
    expect(reminderDueOn(bad, at("2026-10-17T07:00:00Z"))).toBe("2026-10-17");
  });
});
