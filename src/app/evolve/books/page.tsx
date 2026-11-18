import Link from "next/link";
import { ArrowLeft, ArrowRight, Library, PenLine, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { formatBookPrice } from "@/lib/book-price";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { interpolate, plural } from "@/lib/i18n/format";
import { getLocale } from "@/lib/i18n/get-locale";
import {
  applyToBeAuthor,
  createBookSubmission,
  updateBookSubmission,
} from "./actions";

type ApplicationRow = {
  id: string;
  bio: string;
  reason: string;
  website: string | null;
  status: "pending" | "approved" | "rejected" | "more_info_requested";
  review_notes: string | null;
};

type BookRow = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  price_cents: number | null;
  status: string;
  review_notes: string | null;
  manuscript_filename: string | null;
};

type PublishedBookRow = {
  id: string;
  title: string;
  cover_path: string | null;
  price_cents: number | null;
  profiles: { display_name: string | null } | null;
};

const STATUS_ORDER = [
  "draft",
  "pending_review",
  "changes_requested",
  "rejected",
  "approved",
  "published",
  "unpublished",
] as const;

export default async function BooksPage(props: PageProps<"/evolve/books">) {
  const searchParams = await props.searchParams;
  const editId = Array.isArray(searchParams.edit)
    ? searchParams.edit[0]
    : searchParams.edit;
  const showApplyFlow =
    (Array.isArray(searchParams.apply)
      ? searchParams.apply[0]
      : searchParams.apply) === "1";

  const { supabase, user } = await requireUser();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.books;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_author")
    .eq("id", user.id)
    .single();

  const { data: publishedBooks } = await supabase
    .from("books")
    .select("id, title, cover_path, price_cents, profiles(display_name)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<PublishedBookRow[]>();

  const library = publishedBooks ?? [];

  const librarySection = (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t.library.heading}
        </p>
        {library.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {plural(locale, library.length, t.library.bookCount)}
          </span>
        )}
      </div>
      {library.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-12 text-center">
          <Library className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.library.empty}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {library.map((book) => {
            const coverUrl = book.cover_path
              ? supabase.storage.from("book-covers").getPublicUrl(book.cover_path)
                  .data.publicUrl
              : null;
            return (
              <Link
                key={book.id}
                href={`/evolve/books/${book.id}`}
                className="space-y-2 rounded-xl border bg-card p-3 transition-colors hover:bg-accent"
              >
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <Library className="size-6 text-muted-foreground/40" />
                  )}
                </div>
                <div>
                  <p className="truncate text-sm font-medium">{book.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {book.profiles?.display_name ?? t.library.defaultAuthor}
                  </p>
                </div>
                <Badge variant={book.price_cents ? "outline" : "secondary"}>
                  {book.price_cents
                    ? formatBookPrice(locale, book.price_cents)
                    : t.library.free}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  if (!profile?.is_author) {
    const { data: application } = await supabase
      .from("author_applications")
      .select("id, bio, reason, website, status, review_notes")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<ApplicationRow>();

    if (!showApplyFlow) {
      return (
        <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
          <PatternBorder />
          <BackLink href="/evolve" label={dict.nav.evolve} />
          <div>
            <h1 className="text-2xl font-heading font-semibold">
              {t.catalogue.heading}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.catalogue.readerSubheading}
            </p>
          </div>

          {librarySection}

          {application?.status !== "rejected" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {application?.status === "pending"
                      ? t.application.eyebrowPending
                      : t.application.eyebrowDefault}
                  </p>
                  <h2 className="font-heading text-xl font-bold text-foreground text-balance">
                    {application?.status === "pending"
                      ? t.application.headingPending
                      : application?.status === "more_info_requested"
                        ? t.application.headingMoreInfo
                        : t.application.headingDefault}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {application?.status === "pending"
                      ? t.application.bodyPending
                      : application?.status === "more_info_requested"
                        ? t.application.bodyMoreInfo
                        : t.application.bodyDefault}
                  </p>
                </div>
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5">
                  <PenLine className="size-9 text-primary" />
                </div>
              </div>

              {application?.status !== "pending" && (
                <Button
                  render={<Link href="/evolve/books?apply=1" />}
                  nativeButton={false}
                  size="lg"
                  className="w-full rounded-full"
                >
                  {application?.status === "more_info_requested"
                    ? t.application.continueApplication
                    : t.application.applyNow}
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          )}

          {application?.status === "rejected" && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <p className="font-medium">
                {t.application.rejected}
              </p>
              {application.review_notes && (
                <p className="mt-1 text-muted-foreground">
                  {application.review_notes}
                </p>
              )}
            </div>
          )}
        </main>
      );
    }

    return (
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
        <PatternBorder />
        <Link
          href="/evolve/books"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t.application.backToLibrary}
        </Link>

        {application?.status === "pending" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
            <Sparkles className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {t.application.underReview}
            </p>
          </div>
        ) : (
          <form
            action={applyToBeAuthor}
            className="space-y-3 rounded-xl border bg-card p-4"
          >
            <p className="text-sm font-semibold">
              {t.application.formHeading}
            </p>
            {application?.status === "more_info_requested" && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <p className="font-medium text-primary">
                  {t.application.moreInfoRequested}
                </p>
                {application.review_notes && (
                  <p className="mt-1">{application.review_notes}</p>
                )}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="bio">{t.application.bioLabel}</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={application?.bio}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reason">
                {t.application.reasonLabel}
              </Label>
              <Textarea
                id="reason"
                name="reason"
                rows={3}
                defaultValue={application?.reason}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">
                {t.application.websiteLabel}
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={application?.website ?? ""}
              />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="agreement" required className="mt-0.5" />
              {t.application.agreement}
            </label>
            <Button type="submit" size="sm">
              {application ? t.application.resubmit : t.application.submit}
            </Button>
          </form>
        )}
      </main>
    );
  }

  const { data: books } = await supabase
    .from("books")
    .select(
      "id, title, description, categories, price_cents, status, review_notes, manuscript_filename",
    )
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .returns<BookRow[]>();

  const rows = books ?? [];
  const editing = editId ? rows.find((b) => b.id === editId) : undefined;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/evolve" label={dict.nav.evolve} />
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          {t.catalogue.heading}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.catalogue.authorSubheading}
        </p>
      </div>

      {librarySection}

      <form
        action={
          editing
            ? updateBookSubmission.bind(null, editing.id)
            : createBookSubmission
        }
        encType="multipart/form-data"
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? t.submission.editBook : t.submission.newBook}
        </p>
        {editing?.review_notes && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <p className="font-medium text-primary">{t.submission.reviewerFeedback}</p>
            <p className="mt-1">{editing.review_notes}</p>
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="title">{t.submission.titleLabel}</Label>
          <Input id="title" name="title" defaultValue={editing?.title} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">{t.submission.descriptionLabel}</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={editing?.description}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categories">{t.submission.categoriesLabel}</Label>
          <Input
            id="categories"
            name="categories"
            placeholder={t.submission.categoriesPlaceholder}
            defaultValue={editing?.categories.join(", ")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="manuscript">{t.submission.manuscriptLabel}</Label>
          <Input id="manuscript" name="manuscript" type="file" accept=".pdf,.epub" />
          {editing?.manuscript_filename && (
            <p className="text-xs text-muted-foreground">
              {interpolate(t.submission.currentFile, {
                filename: editing.manuscript_filename,
              })}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cover">{t.submission.coverLabel}</Label>
          <Input id="cover" name="cover" type="file" accept="image/*" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price_usd">
            {t.submission.priceLabel}
          </Label>
          <Input
            id="price_usd"
            name="price_usd"
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              editing?.price_cents
                ? (editing.price_cents / 100).toFixed(2)
                : ""
            }
          />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="rights_attestation" className="mt-0.5" />
          {t.submission.rightsAttestation}
        </label>
        <div className="flex justify-end gap-2">
          <Button type="submit" name="intent" value="draft" size="sm" variant="outline">
            {t.submission.saveDraft}
          </Button>
          <Button type="submit" name="intent" value="submit" size="sm">
            {t.submission.submitForReview}
          </Button>
        </div>
      </form>

      {STATUS_ORDER.map((status) => {
        const group = rows.filter((b) => b.status === status);
        if (group.length === 0) {
          return null;
        }
        return (
          <div key={status} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t.submission.statusLabels[status]} — {group.length}
            </p>
            <div className="divide-y rounded-xl border bg-card">
              {group.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.price_cents
                        ? formatBookPrice(locale, b.price_cents)
                        : t.library.free}
                    </p>
                  </div>
                  <Button
                    render={<Link href={`/evolve/books?edit=${b.id}`} />}
                    nativeButton={false}
                    size="xs"
                    variant="outline"
                  >
                    {t.submission.edit}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}
