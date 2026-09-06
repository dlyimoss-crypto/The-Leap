import { describe, expect, test } from "vitest";
import { getJourneyMeta, getJourneySession } from "./journeys";

describe("getJourneyMeta", () => {
  test("returns the Faith in Christ journey's metadata", () => {
    expect(getJourneyMeta("faith-in-christ")).toEqual({
      slug: "faith-in-christ",
      domain: "faith-in-christ",
      title: "Faith in Christ",
      purpose:
        "To help a person understand who Jesus is, what He has accomplished, what it means to place faith in Him, and what it means to begin following Him.",
      durationDays: 7,
      completionTitle: "You've taken your first Leap.",
    });
  });

  test("returns null for a journey that doesn't exist", () => {
    expect(getJourneyMeta("does-not-exist")).toBeNull();
  });

  test("returns null for a slug that isn't a plain lowercase-hyphen name", () => {
    expect(getJourneyMeta("../../../../etc/passwd")).toBeNull();
  });

  test("does not escape the content/en directory via a traversal slug", () => {
    expect(getJourneyMeta("..")).toBeNull();
  });
});

describe("getJourneySession", () => {
  test("returns day 1 of the Faith in Christ journey", () => {
    expect(getJourneySession("faith-in-christ", 1)).toEqual({
      day: 1,
      title: "Why Jesus?",
      scriptureReference: "John 1:1-5; John 1:14; Colossians 1:15-20",
      message:
        "Before anything existed, Jesus did. John doesn't open with a manger — he opens with eternity: \"In the beginning was the Word, and the Word was with God, and the Word was God.\" That Word became flesh and moved into our neighborhood. So Jesus isn't a good teacher who showed up in history — He's the eternal God who stepped into it. Whatever you've believed about Him before today, start here: He is Lord over all things, and He came near on purpose.",
      explore:
        "Jesus as Lord, Son, Savior and the One through whom all things were made.",
      reflect:
        "What have you previously believed about Jesus? Who is Jesus to you today?",
      pray: "Jesus, help me to see You more clearly. Give me an open heart as I discover who You are.",
      nextTopic: "What is the Gospel?",
    });
  });

  test("returns null for a day outside the journey's range", () => {
    expect(getJourneySession("faith-in-christ", 99)).toBeNull();
  });

  test("returns null for a journey that doesn't exist", () => {
    expect(getJourneySession("does-not-exist", 1)).toBeNull();
  });

  test("returns null for a slug that isn't a plain lowercase-hyphen name", () => {
    expect(getJourneySession("../../../../etc/passwd", 1)).toBeNull();
  });
});
