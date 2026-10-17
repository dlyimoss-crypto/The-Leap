// Converts the official Berean Standard Bible text export into the JSON the
// app reads at runtime (content/bible/bsb/bsb.json).
//
//   curl -sSLO https://bereanbible.com/bsb.txt
//   node scripts/build-bsb.mjs bsb.txt
//
// The BSB is public domain (berean.bible/terms.htm, 30 April 2023). Keep the
// text verbatim: the publisher asks that altered texts not use the Berean name.
import fs from "node:fs";
import path from "node:path";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/build-bsb.mjs <path to bsb.txt>");
  process.exit(1);
}

// Lines look like "Genesis 1:1<TAB>In the beginning…". The first three lines
// are a credit and a header, which this pattern skips.
const VERSE_LINE = /^(.+) (\d+):(\d+)\t(.*)$/;

const books = [];
let verseCount = 0;

for (const rawLine of fs.readFileSync(input, "utf-8").split(/\r?\n/)) {
  const match = VERSE_LINE.exec(rawLine.replace(/^﻿/, ""));
  if (!match) continue;

  const [, name, chapterStr, verseStr, text] = match;
  const chapter = Number(chapterStr);
  const verse = Number(verseStr);

  let book = books.at(-1);
  if (book?.name !== name) {
    book = { name, chapters: [] };
    books.push(book);
  }
  book.chapters[chapter - 1] ??= [];
  // Verses the BSB omits (e.g. Matthew 17:21) are present with empty text;
  // keeping them as "" preserves verse numbering by array index.
  book.chapters[chapter - 1][verse - 1] = text.trim();
  verseCount++;
}

if (books.length !== 66) {
  throw new Error(`Expected 66 books, found ${books.length}`);
}
for (const book of books) {
  book.chapters.forEach((verses, i) => {
    if (!verses || verses.includes(undefined)) {
      throw new Error(`Gap in ${book.name} ${i + 1}`);
    }
  });
}

const outFile = path.join("content", "bible", "bsb", "bsb.json");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ translation: "BSB", books }));
console.log(`Wrote ${outFile}: ${books.length} books, ${verseCount} verses`);
