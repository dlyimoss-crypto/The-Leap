import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TRANSLATION,
  formatReference,
  getChapter,
  getScripture,
  listBooks,
  parseReference,
  searchVerses,
  type BookSummary,
} from "@/lib/content/scripture";
import { TRANSLATIONS } from "@/lib/content/translations";
import { saveBookmark, removeBookmark } from "./actions";

export function bibleHref(params: { ref?: string; book?: string; q?: string }) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `/evolve/scripture?${query}` : "/evolve/scripture";
}

// The Bible tab walks book list → chapter grid → chapter, with a search box
// that takes either a reference ("John 3:16" opens it) or words to find.
export function BibleTab({
  q,
  refParam,
  bookParam,
  bookmarkedKeys,
}: {
  q: string;
  refParam?: string;
  bookParam?: string;
  bookmarkedKeys: Set<string>;
}) {
  const parsedRef = refParam ? parseReference(refParam) : null;
  const book = bookParam
    ? listBooks().find((b) => b.name === bookParam)
    : undefined;

  let body: React.ReactNode;
  if (refParam) {
    if (!parsedRef) {
      body = <NotFound reference={refParam} />;
    } else if (
      parsedRef.startVerse === null &&
      parsedRef.startChapter === parsedRef.endChapter
    ) {
      body = (
        <ChapterView
          book={parsedRef.book}
          chapter={parsedRef.startChapter}
          bookmarkedKeys={bookmarkedKeys}
        />
      );
    } else {
      body = (
        <PassageView
          reference={formatReference(parsedRef)}
          book={parsedRef.book}
          chapter={parsedRef.startChapter}
          bookmarkedKeys={bookmarkedKeys}
        />
      );
    }
  } else if (q) {
    body = <SearchResults q={q} />;
  } else if (book) {
    body = <ChapterGrid book={book} />;
  } else {
    body = <BookList />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {TRANSLATIONS.map((translation) => (
          <Badge
            key={translation.code}
            variant={translation.available ? "default" : "outline"}
            className={translation.available ? undefined : "text-muted-foreground"}
          >
            {translation.code}
            {!translation.available && " · Coming soon"}
          </Badge>
        ))}
      </div>

      <form
        action="/evolve/scripture"
        method="GET"
        className="flex items-center gap-2 rounded-full border bg-card px-3 py-2"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="John 3:16, or words to find…"
          className="w-full bg-transparent text-sm outline-none"
        />
        <Button type="submit" size="xs" variant="secondary">
          Search
        </Button>
      </form>

      {body}

      <p className="pt-2 text-center text-xs text-muted-foreground">
        Scripture from the Berean Standard Bible (BSB), public domain.
      </p>
    </div>
  );
}

function BookList() {
  const books = listBooks();
  return (
    <div className="space-y-5">
      {(["old", "new"] as const).map((testament) => (
        <section key={testament} className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-primary">
            {testament === "old" ? "Old Testament" : "New Testament"}
          </h2>
          <div className="grid grid-cols-2 gap-1.5">
            {books
              .filter((b) => b.testament === testament)
              .map((b) => (
                <Link
                  key={b.name}
                  href={bibleHref({ book: b.name })}
                  className="truncate rounded-lg border bg-card px-3 py-2 text-sm hover:bg-muted"
                >
                  {b.name}
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ChapterGrid({ book }: { book: BookSummary }) {
  return (
    <div className="space-y-3">
      <Link
        href={bibleHref({})}
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> All books
      </Link>
      <h2 className="text-xl font-heading font-semibold">{book.name}</h2>
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map((n) => (
          <Link
            key={n}
            href={bibleHref({ ref: `${book.name} ${n}` })}
            className="rounded-lg border bg-card py-2 text-center text-sm hover:bg-muted"
          >
            {n}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ChapterView({
  book,
  chapter,
  bookmarkedKeys,
}: {
  book: string;
  chapter: number;
  bookmarkedKeys: Set<string>;
}) {
  const data = getChapter(book, chapter)!;
  const reference = `${book} ${chapter}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={bibleHref({ book })}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> {book}
        </Link>
        <SaveButton
          reference={reference}
          saved={bookmarkedKeys.has(`${reference}::${TRANSLATION}`)}
        />
      </div>
      <h2 className="text-xl font-heading font-semibold">{reference}</h2>
      <div className="space-y-2 leading-relaxed">
        {data.verses.map((verse) => (
          <p key={verse.number}>
            <Link
              href={bibleHref({ ref: `${book} ${chapter}:${verse.number}` })}
              className="mr-1 align-super text-xs font-semibold text-primary"
            >
              {verse.number}
            </Link>
            {verse.text}
          </p>
        ))}
      </div>
      <div className="flex justify-between gap-2">
        {chapter > 1 ? (
          <Button
            render={<Link href={bibleHref({ ref: `${book} ${chapter - 1}` })} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="size-3.5" /> {book} {chapter - 1}
          </Button>
        ) : (
          <span />
        )}
        {chapter < data.chapterCount && (
          <Button
            render={<Link href={bibleHref({ ref: `${book} ${chapter + 1}` })} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            {book} {chapter + 1} <ChevronRight className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

function PassageView({
  reference,
  book,
  chapter,
  bookmarkedKeys,
}: {
  reference: string;
  book: string;
  chapter: number;
  bookmarkedKeys: Set<string>;
}) {
  const passage = getScripture(reference)!;

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <blockquote className="space-y-1 border-l-2 border-primary/30 pl-3">
        <p className="text-foreground italic">
          {passage.text || "This verse is not included in the BSB, which follows the oldest manuscripts."}
        </p>
        <cite className="block text-sm text-muted-foreground not-italic">
          {passage.reference} ({passage.translation})
        </cite>
      </blockquote>
      <div className="flex flex-wrap items-center gap-2">
        <SaveButton
          reference={reference}
          saved={bookmarkedKeys.has(`${reference}::${TRANSLATION}`)}
        />
        <Button
          render={<Link href={bibleHref({ ref: `${book} ${chapter}` })} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
        >
          Read {book} {chapter}
        </Button>
      </div>
    </div>
  );
}

function SearchResults({ q }: { q: string }) {
  const { results, total } = searchVerses(q);

  if (total === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No verses match &ldquo;{q}&rdquo;.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {total > results.length
          ? `Showing the first ${results.length} of ${total} verses`
          : `${total} verse${total === 1 ? "" : "s"}`}{" "}
        containing &ldquo;{q}&rdquo;
      </p>
      {results.map((result) => (
        <Link
          key={result.reference}
          href={bibleHref({ ref: result.reference })}
          className="block space-y-0.5 rounded-lg px-3 py-2 hover:bg-muted"
        >
          <span className="block text-sm font-semibold">{result.reference}</span>
          <span className="block text-sm text-muted-foreground">{result.text}</span>
        </Link>
      ))}
    </div>
  );
}

function NotFound({ reference }: { reference: string }) {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">
      Couldn&apos;t find &ldquo;{reference}&rdquo; in the Bible.
    </p>
  );
}

function SaveButton({ reference, saved }: { reference: string; saved: boolean }) {
  return (
    <form
      action={(saved ? removeBookmark : saveBookmark).bind(
        null,
        reference,
        TRANSLATION,
      )}
    >
      <Button type="submit" size="sm" variant={saved ? "secondary" : "outline"}>
        {saved ? (
          <>
            <BookmarkCheck className="size-3.5" /> Saved
          </>
        ) : (
          <>
            <Bookmark className="size-3.5" /> Save
          </>
        )}
      </Button>
    </form>
  );
}
