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
      explore:
        "Jesus as Lord, Son, Savior and the One through whom all things were made.",
      reflect:
        "What have you previously believed about Jesus? Who is Jesus to you today?",
      pray: "Jesus, help me to see You more clearly. Give me an open heart as I discover who You are.",
      practice: "Read John 1:1-14 slowly for five minutes.",
      connect: "What word or idea about Jesus stood out to you today?",
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
