import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComingSoon } from "@/components/coming-soon";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import {
  formatReference,
  getScripture,
  parseReference,
} from "@/lib/content/scripture";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { removeBookmark } from "./actions";
import { BibleTab, bibleHref } from "./bible-tab";

type Tab = "bible" | "plans" | "favorites";

const TABS: Tab[] = ["bible", "plans", "favorites"];

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
  const book = Array.isArray(searchParams.book) ? searchParams.book[0] : searchParams.book;

  // A search that is really a reference ("john 3:16") goes straight to it.
  const searchedRef = q ? parseReference(q) : null;
  if (searchedRef) {
    redirect(bibleHref({ ref: formatReference(searchedRef) }));
  }

  const { supabase, user } = await requireUser();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.evolve.scripture;

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


  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/evolve" label={dict.nav.evolve} />
      <div>
        <h1 className="text-2xl font-heading font-semibold">{t.heading}</h1>
        <p className="text-sm text-muted-foreground">{t.subheading}</p>
      </div>

      <div className="flex gap-4 border-b">
        {TABS.map((key) => (
          <Link
            key={key}
            href={key === "bible" ? "/evolve/scripture" : `/evolve/scripture?tab=${key}`}
            className={
              key === tab
                ? "border-b-2 border-primary pb-2 text-sm font-semibold text-primary"
                : "pb-2 text-sm font-medium text-muted-foreground"
            }
          >
            {t.tabs[key]}
          </Link>
        ))}
      </div>

      {tab === "bible" && (
        <BibleTab
          q={q}
          refParam={ref}
          bookParam={book}
          bookmarkedKeys={bookmarkedKeys}
          dict={dict.evolve.bible}
          locale={locale}
        />
      )}

      {tab === "plans" && (
        <ComingSoon
          icon={ListChecks}
          title={t.plansTitle}
          description={t.plansDescription}
        />
      )}

      {tab === "favorites" && (
        <div className="space-y-3">
          {bookmarks.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Bookmark className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {t.favoritesEmpty}
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
                <Link
                  href={bibleHref({ ref: bookmark.reference })}
                  className="block space-y-2"
                >
                  <p className="text-sm font-semibold">
                    {bookmark.reference}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({bookmark.translation})
                    </span>
                  </p>
                  {passage && (
                    <p className="line-clamp-4 text-sm text-muted-foreground italic">
                      {passage.text}
                    </p>
                  )}
                </Link>
                <form
                  action={removeBookmark.bind(
                    null,
                    bookmark.reference,
                    bookmark.translation,
                  )}
                >
                  <Button type="submit" size="xs" variant="ghost">
                    {t.remove}
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
