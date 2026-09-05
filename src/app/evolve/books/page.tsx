import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Library, PenLine, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
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

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  changes_requested: "Changes Requested",
  rejected: "Rejected",
  approved: "Approved",
  published: "Published",
  unpublished: "Unpublished",
};

const STATUS_ORDER = [
  "draft",
  "pending_review",
  "changes_requested",
  "rejected",
  "approved",
  "published",
  "unpublished",
];

export default async function BooksPage(props: PageProps<"/evolve/books">) {
  const searchParams = await props.searchParams;
  const editId = Array.isArray(searchParams.edit)
    ? searchParams.edit[0]
    : searchParams.edit;
  const showApplyFlow =
    (Array.isArray(searchParams.apply)
      ? searchParams.apply[0]
      : searchParams.apply) === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

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
          Library
        </p>
        {library.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {library.length} {library.length === 1 ? "book" : "books"}
          </span>
        )}
      </div>
      {library.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-12 text-center">
          <Library className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No books published yet — be the first to share one below.
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
              <div
                key={book.id}
                className="space-y-2 rounded-xl border bg-card p-3"
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
                    {book.profiles?.display_name ?? "The Leap"}
                  </p>
                </div>
                <Badge variant={book.price_cents ? "outline" : "secondary"}>
                  {book.price_cents
                    ? `$${(book.price_cents / 100).toFixed(2)}`
                    : "Free"}
                </Badge>
              </div>
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
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
          <div>
            <h1 className="text-2xl font-heading font-semibold">
              Books & Literature
            </h1>
            <p className="text-sm text-muted-foreground">
              Go deeper through books, teachings and curated resources.
            </p>
          </div>

          {librarySection}

          {application?.status !== "rejected" && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {application?.status === "pending"
                      ? "Author Application"
                      : "Become an Author"}
                  </p>
                  <h2 className="font-heading text-xl font-bold text-foreground text-balance">
                    {application?.status === "pending"
                      ? "Your application is under review"
                      : application?.status === "more_info_requested"
                        ? "We need a bit more from you"
                        : "Publish your book with The Leap"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {application?.status === "pending"
                      ? "We'll let you know as soon as it's reviewed."
                      : application?.status === "more_info_requested"
                        ? "Pick up your application where you left off."
                        : "Share your writing with our community — free or paid, your choice."}
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
                    ? "Continue application"
                    : "Apply now"}
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          )}

          {application?.status === "rejected" && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <p className="font-medium">
                Your author application wasn&apos;t approved.
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
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
        <Link
          href="/evolve/books"
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Library
        </Link>

        {application?.status === "pending" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
            <Sparkles className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Your author application is under review.
            </p>
          </div>
        ) : (
          <form
            action={applyToBeAuthor}
            className="space-y-3 rounded-xl border bg-card p-4"
          >
            <p className="text-sm font-semibold">
              Apply to become an author
            </p>
            {application?.status === "more_info_requested" && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <p className="font-medium text-primary">
                  More information requested
                </p>
                {application.review_notes && (
                  <p className="mt-1">{application.review_notes}</p>
                )}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="bio">A little about you</Label>
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
                Why do you want to publish with The Leap?
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
                Website or profile link (optional)
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
              I agree to The Leap&apos;s publishing requirements.
            </label>
            <Button type="submit" size="sm">
              {application ? "Resubmit application" : "Submit application"}
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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Books & Literature
        </h1>
        <p className="text-sm text-muted-foreground">
          Submit a book for review — approved books join the Library.
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
          {editing ? "Edit book" : "New book"}
        </p>
        {editing?.review_notes && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <p className="font-medium text-primary">Reviewer feedback</p>
            <p className="mt-1">{editing.review_notes}</p>
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={editing?.title} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={editing?.description}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categories">Categories (comma-separated)</Label>
          <Input
            id="categories"
            name="categories"
            placeholder="Discipleship, Christian Living"
            defaultValue={editing?.categories.join(", ")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="manuscript">Manuscript (PDF or EPUB)</Label>
          <Input id="manuscript" name="manuscript" type="file" accept=".pdf,.epub" />
          {editing?.manuscript_filename && (
            <p className="text-xs text-muted-foreground">
              Current file: {editing.manuscript_filename}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cover">Cover image</Label>
          <Input id="cover" name="cover" type="file" accept="image/*" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price_usd">
            Price in USD (leave blank for free)
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
          I confirm that I own the rights to this work, or have permission to
          publish it.
        </label>
        <div className="flex justify-end gap-2">
          <Button type="submit" name="intent" value="draft" size="sm" variant="outline">
            Save draft
          </Button>
          <Button type="submit" name="intent" value="submit" size="sm">
            Submit for review
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
              {STATUS_LABEL[status]} — {group.length}
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
                        ? `$${(b.price_cents / 100).toFixed(2)}`
                        : "Free"}
                    </p>
                  </div>
                  <Button
                    render={<Link href={`/evolve/books?edit=${b.id}`} />}
                    nativeButton={false}
                    size="xs"
                    variant="outline"
                  >
                    Edit
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
