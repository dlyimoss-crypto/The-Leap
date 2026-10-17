import fs from "node:fs";
import path from "node:path";

export type ScripturePassage = {
  reference: string;
  translation: string;
  text: string;
};

export type BookSummary = {
  name: string;
  chapterCount: number;
  testament: "old" | "new";
};

export type ChapterVerse = { number: number; text: string };

export type Chapter = {
  book: string;
  chapter: number;
  chapterCount: number;
  verses: ChapterVerse[];
};

// A parsed reference. A whole chapter has no verses; a single verse has
// startVerse === endVerse. Ranges may cross chapters ("John 3:16-4:2").
export type ParsedReference = {
  book: string;
  startChapter: number;
  startVerse: number | null;
  endChapter: number;
  endVerse: number | null;
};

// The whole Berean Standard Bible (public domain), built from the official
// text export by scripts/build-bsb.mjs.
const DATASET_PATH = path.join(
  process.cwd(),
  "content",
  "bible",
  "bsb",
  "bsb.json",
);

export const TRANSLATION = "BSB";

// Matthew is book 40 of 66.
const FIRST_NEW_TESTAMENT_BOOK = 39;

// Names people commonly type that differ from the BSB's book titles.
const BOOK_ALIASES = new Map([
  ["psalms", "psalm"],
  ["song of songs", "song of solomon"],
  ["canticles", "song of solomon"],
]);

type Dataset = {
  translation: string;
  // chapters[c][v] is the text of chapter c+1, verse v+1; "" where the BSB
  // omits a verse (e.g. Matthew 17:21).
  books: { name: string; chapters: string[][] }[];
};

let dataset: Dataset | null = null;
let booksByName: Map<string, Dataset["books"][number]> | null = null;

function loadDataset(): Dataset {
  if (!dataset) {
    dataset = JSON.parse(fs.readFileSync(DATASET_PATH, "utf-8")) as Dataset;
    booksByName = new Map(dataset.books.map((b) => [b.name.toLowerCase(), b]));
  }
  return dataset;
}

function findBook(name: string) {
  loadDataset();
  const key = name.trim().replace(/\s+/g, " ").toLowerCase();
  const exact = booksByName!.get(BOOK_ALIASES.get(key) ?? key);
  if (exact) {
    return exact;
  }
  // Accept an unambiguous prefix, so "rom" or "1 cor" work in search.
  const matches = dataset!.books.filter((b) =>
    b.name.toLowerCase().startsWith(key),
  );
  return key.length >= 2 && matches.length === 1 ? matches[0] : null;
}

export function listBooks(): BookSummary[] {
  return loadDataset().books.map((book, i) => ({
    name: book.name,
    chapterCount: book.chapters.length,
    testament: i < FIRST_NEW_TESTAMENT_BOOK ? "old" : "new",
  }));
}

const REFERENCE =
  /^(.+?)\s+(\d+)(?::(\d+))?(?:\s*[-–]\s*(\d+)(?::(\d+))?)?$/;

export function parseReference(input: string): ParsedReference | null {
  const match = REFERENCE.exec(input.trim());
  if (!match) {
    return null;
  }
  const [, bookName, a, b, c, d] = match;
  const book = findBook(bookName);
  if (!book) {
    return null;
  }

  let startChapter = Number(a);
  let startVerse = b ? Number(b) : null;
  let endChapter = startChapter;
  let endVerse = startVerse;

  // Single-chapter books are cited by verse alone: "Jude 3", "Jude 3-5".
  if (book.chapters.length === 1 && !b && !d) {
    startVerse = startChapter;
    endVerse = c ? Number(c) : startVerse;
    startChapter = endChapter = 1;
  } else if (d) {
    endChapter = Number(c);
    endVerse = Number(d);
  } else if (c) {
    if (startVerse === null) {
      // "John 3-4": a span of whole chapters.
      endChapter = Number(c);
    } else {
      endVerse = Number(c);
    }
  }

  const verseCount = (chapter: number) => book.chapters[chapter - 1]?.length;
  const valid =
    verseCount(startChapter) !== undefined &&
    verseCount(endChapter) !== undefined &&
    (startChapter < endChapter ||
      (startChapter === endChapter &&
        (startVerse ?? 0) <= (endVerse ?? 0))) &&
    (startVerse === null ||
      (startVerse >= 1 && startVerse <= verseCount(startChapter)!)) &&
    (endVerse === null ||
      (endVerse >= 1 && endVerse <= verseCount(endChapter)!));

  return valid
    ? { book: book.name, startChapter, startVerse, endChapter, endVerse }
    : null;
}

export function formatReference(ref: ParsedReference): string {
  const { book, startChapter, startVerse, endChapter, endVerse } = ref;
  if (startVerse === null) {
    return startChapter === endChapter
      ? `${book} ${startChapter}`
      : `${book} ${startChapter}-${endChapter}`;
  }
  if (startChapter !== endChapter) {
    return `${book} ${startChapter}:${startVerse}-${endChapter}:${endVerse}`;
  }
  return startVerse === endVerse
    ? `${book} ${startChapter}:${startVerse}`
    : `${book} ${startChapter}:${startVerse}-${endVerse}`;
}

export function getScripture(reference: string): ScripturePassage | null {
  const ref = parseReference(reference);
  if (!ref) {
    return null;
  }
  const chapters = findBook(ref.book)!.chapters;
  const texts: string[] = [];
  for (let c = ref.startChapter; c <= ref.endChapter; c++) {
    const verses = chapters[c - 1];
    const from = c === ref.startChapter && ref.startVerse ? ref.startVerse : 1;
    const to = c === ref.endChapter && ref.endVerse ? ref.endVerse : verses.length;
    texts.push(...verses.slice(from - 1, to).filter(Boolean));
  }
  return {
    reference,
    translation: loadDataset().translation,
    text: texts.join(" "),
  };
}

export function getScripturePassages(
  combinedReference: string,
): Array<{ reference: string; passage: ScripturePassage | null }> {
  return combinedReference.split(";").map((raw) => {
    const reference = raw.trim();
    return { reference, passage: getScripture(reference) };
  });
}

export function getChapter(bookName: string, chapter: number): Chapter | null {
  const book = findBook(bookName);
  const verses = book?.chapters[chapter - 1];
  if (!book || !verses) {
    return null;
  }
  return {
    book: book.name,
    chapter,
    chapterCount: book.chapters.length,
    verses: verses
      .map((text, i) => ({ number: i + 1, text }))
      .filter((v) => v.text),
  };
}

export function searchVerses(
  query: string,
  limit = 50,
): { results: ScripturePassage[]; total: number } {
  const needle = query.trim().toLowerCase();
  const results: ScripturePassage[] = [];
  let total = 0;
  if (needle.length < 2) {
    return { results, total };
  }
  const { translation, books } = loadDataset();
  for (const book of books) {
    book.chapters.forEach((verses, c) => {
      verses.forEach((text, v) => {
        if (text.toLowerCase().includes(needle)) {
          total++;
          if (results.length < limit) {
            results.push({
              reference: `${book.name} ${c + 1}:${v + 1}`,
              translation,
              text,
            });
          }
        }
      });
    });
  }
  return { results, total };
}
