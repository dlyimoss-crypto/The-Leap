import { describe, expect, test } from "vitest";
import { getScripture, getScripturePassages } from "./scripture";

describe("getScripture", () => {
  test("returns the WEB text for a known reference", () => {
    expect(getScripture("John 1:1-5")).toEqual({
      reference: "John 1:1-5",
      translation: "WEB",
      text: "In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God. All things were made through him. Without him was not anything made that has been made. In him was life, and the life was the light of men. The light shines in the darkness, and the darkness hasn’t overcome it.",
    });
  });

  test("returns null for a reference that isn't in the dataset", () => {
    expect(getScripture("Nonexistent 99:99")).toBeNull();
  });

  test("returns null for a reference matching an Object.prototype key", () => {
    expect(getScripture("__proto__")).toBeNull();
  });
});

describe("getScripturePassages", () => {
  test("splits a semicolon-joined reference into individually looked-up passages", () => {
    const result = getScripturePassages("John 1:14; Nonexistent 99:99");

    expect(result).toEqual([
      {
        reference: "John 1:14",
        passage: {
          reference: "John 1:14",
          translation: "WEB",
          text: "The Word became flesh, and lived among us. We saw his glory, such glory as of the one and only Son of the Father, full of grace and truth.",
        },
      },
      { reference: "Nonexistent 99:99", passage: null },
    ]);
  });
});
