import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, BookmarkCheck, Search, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComingSoon } from "@/components/coming-soon";
import { BackLink } from "@/components/back-link";
import { createClient } from "@/lib/supabase/server";
import {
  getScripture,
  listCuratedReferences,
} from "@/lib/content/scripture";
import { TRANSLATIONS } from "@/lib/content/translations";
import { saveBookmark, removeBookmark } from "./actions";

type Tab = "bible" | "plans" | "favorites";

const TABS: { key: Tab; label: string }[] = [
  { key: "bible", label: "Bible" },
  { key: "plans", label: "Plans" },
  { key: "favorites", label: "Favorites" },
];

type BookmarkRow = {
  reference: string;
  translation: string;
  created_at: string;
};

export default async function ScripturePage(
  props: PageProps<"/evolve/scripture">,
) {
  const searchParams = await props.searchParams;
  const tabParam = Array.isArray(searchParams.tab)
    ? searchParams.tab[0]
    : searchParams.tab;
  const tab: Tab =
    tabParam === "plans" || tabParam === "favorites" ? tabParam : "bible";
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) ?? "";
  const ref = Array.isArray(searchParams.ref) ? searchParams.ref[0] : searchParams.ref;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: bookmarkRows, error } = await supabase
    .from("scripture_bookmarks")
    .select("reference, translation, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<BookmarkRow[]>();

  if (error) {
    console.error("Failed to load scripture bookmarks", error);
  }

  const bookmarks = bookmarkRows ?? [];
  const bookmarkedKeys = new Set(
    bookmarks.map((b) => `${b.reference}::${b.translation}`),
  );

  const references = listCuratedReferences().filter((reference) =>
    reference.toLowerCase().includes(q.toLowerCase()),
  );
  const selectedPassage = ref ? getScripture(ref) : null;
  const isBookmarked = ref
    ? bookmarkedKeys.has(`${ref}::${selectedPassage?.translation ?? "WEB"}`)
    : false;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <BackLink href="/evolve" label="Evolve" />
      <div>
        <h1 className="text-2xl font-heading font-semibold">Scripture</h1>
        <p className="text-sm text-muted-foreground">
          Read, search, study and save God&apos;s Word.
        </p>
      </div>

      <div className="flex gap-4 border-b">
        {TABS.map(({ key, label }) => (
          <Link
            key={key}
            href={key === "bible" ? "/evolve/scripture" : `/evolve/scripture?tab=${key}`}
            className={
              key === tab
                ? "border-b-2 border-primary pb-2 text-sm font-semibold text-primary"
                : "pb-2 text-sm font-medium text-muted-foreground"
            }
          >
            {label}
          </Link>
        ))}
      </div>

      {tab === "bible" && (
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
            <input type="hidden" name="tab" value="bible" />
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search today's curated passages…"
              className="w-full bg-transparent text-sm outline-none"
            />
            <Button type="submit" size="xs" variant="secondary">
              Search
            </Button>
          </form>

          <div className="space-y-1">
            {references.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No curated passages match &ldquo;{q}&rdquo;.
              </p>
            )}
            {references.map((reference) => (
              <Link
                key={reference}
                href={`/evolve/scripture?tab=bible&q=${encodeURIComponent(q)}&ref=${encodeURIComponent(reference)}`}
                className={
                  reference === ref
                    ? "block rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                    : "block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                }
              >
                {reference}
              </Link>
            ))}
          </div>

          {selectedPassage && (
            <div className="space-y-3 rounded-xl border bg-card p-4">
              <blockquote className="space-y-1 border-l-2 border-primary/30 pl-3">
                <p className="text-foreground italic">{selectedPassage.text}</p>
                <cite className="block text-sm text-muted-foreground not-italic">
                  {selectedPassage.reference} ({selectedPassage.translation})
                </cite>
              </blockquote>
              <form
                action={(isBookmarked ? removeBookmark : saveBookmark).bind(
                  null,
                  selectedPassage.reference,
                  selectedPassage.translation,
                )}
              >
                <Button type="submit" size="sm" variant={isBookmarked ? "secondary" : "outline"}>
                  {isBookmarked ? (
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
            </div>
          )}
        </div>
      )}

      {tab === "plans" && (
        <ComingSoon
          icon={ListChecks}
          title="Reading Plans"
          description="Guided reading plans are coming soon."
        />
      )}

      {tab === "favorites" && (
        <div className="space-y-3">
          {bookmarks.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Bookmark className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Save a passage from the Bible tab to see it here.
              </p>
            </div>
          )}
          {bookmarks.map((bookmark) => {
            const passage = getScripture(bookmark.reference);
            return (
              <div
                key={`${bookmark.reference}::${bookmark.translation}`}
                className="space-y-2 rounded-xl border bg-card p-4"
              >
                <p className="text-sm font-semibold">
                  {bookmark.reference}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({bookmark.translation})
                  </span>
                </p>
                {passage && (
                  <p className="text-sm text-muted-foreground italic">
                    {passage.text}
                  </p>
                )}
                <form
                  action={removeBookmark.bind(
                    null,
                    bookmark.reference,
                    bookmark.translation,
                  )}
                >
                  <Button type="submit" size="xs" variant="ghost">
                    Remove
                  </Button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
