import { describe, expect, it } from "vitest";
import { toAlternatingTurns } from "./companion-conversation";

describe("toAlternatingTurns", () => {
  it("passes through an already-alternating conversation unchanged", () => {
    const messages = [
      { role: "user" as const, content: "hi" },
      { role: "assistant" as const, content: "hello" },
      { role: "user" as const, content: "how are you" },
    ];
    expect(toAlternatingTurns(messages)).toEqual(messages);
  });

  it("merges consecutive same-role messages into one turn", () => {
    const merged = toAlternatingTurns([
      { role: "user", content: "first" },
      { role: "user", content: "second" },
      { role: "assistant", content: "reply" },
    ]);
    expect(merged).toEqual([
      { role: "user", content: "first\n\nsecond" },
      { role: "assistant", content: "reply" },
    ]);
  });

  it("returns an empty array for an empty conversation", () => {
    expect(toAlternatingTurns([])).toEqual([]);
  });
});
