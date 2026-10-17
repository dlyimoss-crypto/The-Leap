import { describe, expect, test } from "vitest";
import {
  formatReference,
  getChapter,
  getScripture,
  getScripturePassages,
  listBooks,
  parseReference,
  searchVerses,
} from "./scripture";

describe("getScripture", () => {
  test("returns the BSB text for a verse range", () => {
    expect(getScripture("John 1:1-5")).toEqual({
      reference: "John 1:1-5",
      translation: "BSB",
      text: "In the beginning was the Word, and the Word was with God, and the Word was God. He was with God in the beginning. Through Him all things were made, and without Him nothing was made that has been made. In Him was life, and that life was the light of men. The Light shines in the darkness, and the darkness has not overcome it.",
    });
  });

  test("returns every verse of a whole chapter", () => {
    const passage = getScripture("Psalm 117");
    expect(passage?.text).toMatch(/^Praise the LORD, all you nations!/);
    expect(passage?.text).toMatch(/Hallelujah!$/);
  });

  test("covers books outside the old curated set", () => {
    expect(getScripture("Genesis 1:1")?.text).toBe(
      "In the beginning God created the heavens and the earth.",
    );
  });

  test("skips verses the BSB omits", () => {
    expect(getScripture("Matthew 17:20-22")?.text).not.toContain("  ");
    expect(getScripture("Matthew 17:21")?.text).toBe("");
  });

  test("returns null for a reference that isn't in the Bible", () => {
    expect(getScripture("Nonexistent 99:99")).toBeNull();
    expect(getScripture("John 22:1")).toBeNull();
    expect(getScripture("John 3:99")).toBeNull();
  });

  test("returns null for a reference matching an Object.prototype key", () => {
    expect(getScripture("__proto__")).toBeNull();
    expect(getScripture("constructor 1:1")).toBeNull();
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
          translation: "BSB",
          text: "The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son from the Father, full of grace and truth.",
        },
      },
      { reference: "Nonexistent 99:99", passage: null },
    ]);
  });
});

describe("parseReference", () => {
  test.each([
    ["John 3:16", "John 3:16"],
    ["john 3:16", "John 3:16"],
    ["John 3:16-18", "John 3:16-18"],
    ["John 3:16-4:2", "John 3:16-4:2"],
    ["John 3", "John 3"],
    ["John 3-4", "John 3-4"],
    ["Psalms 23", "Psalm 23"],
    ["Song of Songs 2:4", "Song of Solomon 2:4"],
    ["rom 8:28", "Romans 8:28"],
    ["1 cor 13", "1 Corinthians 13"],
    ["Jude 3", "Jude 1:3"],
    ["3 John 1:14", "3 John 1:14"],
  ])("%s → %s", (input, expected) => {
    const ref = parseReference(input);
    expect(ref && formatReference(ref)).toBe(expected);
  });

  test.each(["", "love", "Jo 3:16", "John 0:1", "John 3:18-16", "Phil 1:1"])(
    "rejects %j",
    (input) => {
      expect(parseReference(input)).toBeNull();
    },
  );
});

describe("listBooks", () => {
  test("lists all 66 books split into testaments", () => {
    const books = listBooks();
    expect(books).toHaveLength(66);
    expect(books.filter((b) => b.testament === "old")).toHaveLength(39);
    expect(books[39]).toEqual({ name: "Matthew", chapterCount: 28, testament: "new" });
  });
});

describe("getChapter", () => {
  test("returns numbered verses and leaves out omitted ones", () => {
    const chapter = getChapter("Matthew", 17);
    expect(chapter?.chapterCount).toBe(28);
    expect(chapter?.verses.map((v) => v.number)).not.toContain(21);
    expect(chapter?.verses[0]).toEqual({
      number: 1,
      text: expect.stringMatching(/^After six days/),
    });
  });

  test("returns null past the last chapter", () => {
    expect(getChapter("John", 22)).toBeNull();
  });
});

describe("searchVerses", () => {
  test("finds verses containing a phrase, case-insensitively", () => {
    const { results, total } = searchVerses("THE LORD IS MY SHEPHERD");
    expect(total).toBe(1);
    expect(results[0].reference).toBe("Psalm 23:1");
  });

  test("caps the results but reports the full count", () => {
    const { results, total } = searchVerses("love", 10);
    expect(results).toHaveLength(10);
    expect(total).toBeGreaterThan(10);
  });
});
