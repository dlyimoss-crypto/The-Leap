import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { CoverZoom } from "./cover-zoom";

type BookDetailRow = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  cover_path: string | null;
  price_cents: number | null;
  status: string;
  profiles: { display_name: string | null } | null;
};

export default async function BookDetailPage(
  props: PageProps<"/evolve/books/[id]">,
) {
  const { id } = await props.params;

  const { supabase } = await requireUser();

  const { data: book } = await supabase
    .from("books")
    .select(
      "id, title, description, categories, cover_path, price_cents, status, profiles(display_name)",
    )
    .eq("id", id)
    .maybeSingle<BookDetailRow>();

  if (!book || book.status !== "published") {
    notFound();
  }

  const coverUrl = book.cover_path
    ? supabase.storage.from("book-covers").getPublicUrl(book.cover_path).data
        .publicUrl
    : null;

  const isFree = book.price_cents === null;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/evolve/books" label="Library" />

      <div className="flex gap-4">
        <CoverZoom coverUrl={coverUrl} title={book.title} />
        <div className="min-w-0 space-y-1.5">
          <h1 className="font-heading text-xl font-bold text-balance">
            {book.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {book.profiles?.display_name ?? "The Leap"}
          </p>
          <Badge variant={isFree ? "secondary" : "outline"}>
            {isFree ? "Free" : `$${(book.price_cents! / 100).toFixed(2)}`}
          </Badge>
          {book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {book.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-foreground">
        {book.description}
      </p>

      {isFree ? (
        <Button
          render={<Link href={`/evolve/books/${book.id}/read`} />}
          nativeButton={false}
          size="lg"
          className="w-full rounded-full"
        >
          <BookOpen className="size-4" />
          Read now
        </Button>
      ) : (
        <div className="space-y-2 rounded-xl border bg-card p-4 text-center">
          <p className="text-sm font-medium">Purchasing isn&apos;t live yet</p>
          <p className="text-xs text-muted-foreground">
            We&apos;re still wiring up payments for paid titles — check back
            soon to buy this one.
          </p>
        </div>
      )}
    </main>
  );
}
