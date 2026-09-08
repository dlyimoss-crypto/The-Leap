import type { ReactNode } from "react";
import Link from "next/link";
import {
  Inbox,
  Sparkles,
  BookOpen,
  Users2,
  Church,
  Compass,
  HeartHandshake,
  Heart,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/back-link";
import { PatternCorner } from "@/components/pattern-bg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChipListInput } from "@/components/admin/chip-list-input";
import { SuggestibleTextarea } from "@/components/admin/suggestible-textarea";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/authorize";
import { getDevotionStatus } from "@/lib/devotion";
import { getPrayerMovementDaysLeft } from "@/lib/supabase/prayer-movements";
import {
  approveAuthorApplication,
  approveBook,
  banUser,
  createChurch,
  createDevotion,
  createServiceOpportunity,
  deleteChurch,
  deleteDevotion,
  deleteServiceOpportunity,
  publishBook,
  rejectAuthorApplication,
  rejectBook,
  requestAuthorInfo,
  requestBookChanges,
  resolveReport,
  unbanUser,
  unpublishBook,
  updateBookPrice,
  updateChurch,
  updateDevotion,
  updateServiceOpportunity,
  createPrayerMovement,
  updatePrayerMovement,
  activatePrayerMovement,
  archivePrayerMovement,
  deletePrayerMovement,
} from "./actions";
import {
  createJourney,
  deleteJourney,
  publishJourney,
  saveJourneyDay,
  unpublishJourney,
  updateJourney,
} from "./journeys-actions";

type Tab =
  | "queue"
  | "users"
  | "devotions"
  | "books"
  | "churches"
  | "journeys"
  | "opportunities"
  | "prayer";

type ChurchRow = {
  id: string;
  name: string;
  lead_pastor: string | null;
  mission: string | null;
  address: string | null;
  service_time: string | null;
  phone: string | null;
  email: string | null;
  member_count_estimate: number | null;
};

type OpportunityRow = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  link: string | null;
  status: string;
};

type DevotionRow = {
  id: string;
  title: string;
  scripture_reference: string | null;
  body: string;
  reflection: string | null;
  prayer: string | null;
  practice: string | null;
  publish_date: string | null;
};

type ReportRow = {
  id: string;
  target_type: string;
  target_id: string;
  reason: string | null;
  created_at: string;
};

type ContentRow = {
  id: string;
  user_id: string;
  body: string;
  profiles: { display_name: string | null } | null;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  is_banned: boolean;
  gospel_invite_shown_at: string | null;
  gospel_prayer_at: string | null;
};

type ProfileEmailRow = {
  id: string;
  email: string;
};

type AuthorApplicationRow = {
  id: string;
  user_id: string;
  bio: string;
  reason: string;
  website: string | null;
  status: string;
  profiles: { display_name: string | null } | null;
};

type BookRow = {
  id: string;
  author_id: string;
  title: string;
  description: string;
  categories: string[];
  price_cents: number | null;
  status: string;
  manuscript_path: string | null;
  cover_path: string | null;
  profiles: { display_name: string | null } | null;
};

type JourneyRow = {
  id: string;
  slug: string;
  title: string;
  purpose: string;
  duration_days: number;
  completion_title: string;
  teaser: string | null;
  status: string;
};

type PrayerMovementRow = {
  id: string;
  title: string;
  scripture_reference: string | null;
  prayer_points: string[];
  status: string;
  active_until: string | null;
};

type JourneyDayRow = {
  day_number: number;
  title: string;
  scripture_reference: string;
  message: string;
  explore: string;
  reflect: string;
  pray: string | null;
  next_topic: string | null;
};

function TabBadge({ count }: { count: number }) {
  return (
    <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[10px]">
      {count}
    </Badge>
  );
}

export default async function AdminPage(props: PageProps<"/admin">) {
  const searchParams = await props.searchParams;
  const tabParam = Array.isArray(searchParams.tab)
    ? searchParams.tab[0]
    : searchParams.tab;
  const tab: Tab =
    tabParam === "users"
      ? "users"
      : tabParam === "devotions"
        ? "devotions"
        : tabParam === "books"
          ? "books"
          : tabParam === "churches"
            ? "churches"
            : tabParam === "journeys"
              ? "journeys"
              : tabParam === "opportunities"
                ? "opportunities"
                : tabParam === "prayer"
                  ? "prayer"
                  : "queue";
  const editIdParam = Array.isArray(searchParams.edit)
    ? searchParams.edit[0]
    : searchParams.edit;
  const journeyIdParam = Array.isArray(searchParams.journey)
    ? searchParams.journey[0]
    : searchParams.journey;
  const dayParam = Array.isArray(searchParams.day)
    ? searchParams.day[0]
    : searchParams.day;
  const publishErrorParam = Array.isArray(searchParams.publish_error)
    ? searchParams.publish_error[0]
    : searchParams.publish_error;

  await requireAdmin();

  const supabase = await createClient();
  const [{ count: openReportsCount }, { count: pendingApplicationsCount }, { count: pendingBooksCount }] =
    await Promise.all([
      supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("author_applications")
        .select("id", { count: "exact", head: true })
        .in("status", ["pending", "more_info_requested"]),
      supabase
        .from("books")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review"),
    ]);

  const booksNotificationCount =
    (pendingApplicationsCount ?? 0) + (pendingBooksCount ?? 0);

  return (
    <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternCorner corner="top-right" />
      <BackLink href="/" label="Home" />
      <h1 className="text-2xl font-heading font-semibold">Admin</h1>

      <div className="-mx-6 flex gap-4 overflow-x-auto border-b px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/admin"
          className={
            tab === "queue"
              ? "flex shrink-0 items-center gap-1.5 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "flex shrink-0 items-center gap-1.5 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Moderation queue
          {!!openReportsCount && <TabBadge count={openReportsCount} />}
        </Link>
        <Link
          href="/admin?tab=users"
          className={
            tab === "users"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Users
        </Link>
        <Link
          href="/admin?tab=devotions"
          className={
            tab === "devotions"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Devotions
        </Link>
        <Link
          href="/admin?tab=books"
          className={
            tab === "books"
              ? "flex shrink-0 items-center gap-1.5 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "flex shrink-0 items-center gap-1.5 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Books
          {!!booksNotificationCount && <TabBadge count={booksNotificationCount} />}
        </Link>
        <Link
          href="/admin?tab=churches"
          className={
            tab === "churches"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Churches
        </Link>
        <Link
          href="/admin?tab=journeys"
          className={
            tab === "journeys"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Journeys
        </Link>
        <Link
          href="/admin?tab=opportunities"
          className={
            tab === "opportunities"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Opportunities
        </Link>
        <Link
          href="/admin?tab=prayer"
          className={
            tab === "prayer"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          Prayer
        </Link>
      </div>

      {tab === "queue" ? (
        <ModerationQueue />
      ) : tab === "users" ? (
        <UsersList />
      ) : tab === "devotions" ? (
        <DevotionsAdmin editId={editIdParam} />
      ) : tab === "books" ? (
        <BooksAdmin />
      ) : tab === "churches" ? (
        <ChurchesAdmin editId={editIdParam} />
      ) : tab === "opportunities" ? (
        <OpportunitiesAdmin editId={editIdParam} />
      ) : tab === "prayer" ? (
        <PrayerMovementsAdmin editId={editIdParam} />
      ) : (
        <JourneysAdmin
          editId={editIdParam}
          journeyId={journeyIdParam}
          day={dayParam}
          publishError={publishErrorParam}
        />
      )}
    </main>
  );
}

async function ModerationQueue() {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from("reports")
    .select("id, target_type, target_id, reason, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: true })
    .returns<ReportRow[]>();

  if (error) {
    console.error("Failed to load reports", error);
  }

  const rows = reports ?? [];
  const idsByType = {
    post: rows.filter((r) => r.target_type === "post").map((r) => r.target_id),
    comment: rows
      .filter((r) => r.target_type === "comment")
      .map((r) => r.target_id),
    prayer_request: rows
      .filter((r) => r.target_type === "prayer_request")
      .map((r) => r.target_id),
  };

  const [posts, comments, prayerRequests] = await Promise.all([
    idsByType.post.length > 0
      ? supabase
          .from("posts")
          .select("id, user_id, body, profiles(display_name)")
          .in("id", idsByType.post)
          .returns<ContentRow[]>()
      : Promise.resolve({ data: [] as ContentRow[] }),
    idsByType.comment.length > 0
      ? supabase
          .from("comments")
          .select("id, user_id, body, profiles(display_name)")
          .in("id", idsByType.comment)
          .returns<ContentRow[]>()
      : Promise.resolve({ data: [] as ContentRow[] }),
    idsByType.prayer_request.length > 0
      ? supabase
          .from("prayer_requests")
          .select("id, user_id, body, profiles(display_name)")
          .in("id", idsByType.prayer_request)
          .returns<ContentRow[]>()
      : Promise.resolve({ data: [] as ContentRow[] }),
  ]);

  const contentByKey = new Map<string, ContentRow>();
  for (const row of posts.data ?? []) contentByKey.set(`post:${row.id}`, row);
  for (const row of comments.data ?? [])
    contentByKey.set(`comment:${row.id}`, row);
  for (const row of prayerRequests.data ?? [])
    contentByKey.set(`prayer_request:${row.id}`, row);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Inbox className="size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Nothing in the queue.</p>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-xl border bg-card">
      {rows.map((report) => {
        const content = contentByKey.get(
          `${report.target_type}:${report.target_id}`,
        );
        const isCrisis = report.reason === "auto_crisis_detection";

        return (
          <div key={report.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
            <div className="flex items-start gap-3">
              <Avatar name={content?.profiles?.display_name ?? null} />
              <div className="min-w-0 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  Reported {report.target_type.replace("_", " ")}
                  {content?.profiles?.display_name
                    ? ` · ${content.profiles.display_name}`
                    : ""}
                </p>
                <p className="text-sm">
                  {content?.body ?? "(content no longer available)"}
                </p>
                <Badge variant={isCrisis ? "secondary" : "destructive"}>
                  {isCrisis
                    ? "Auto-flagged: crisis keywords"
                    : "Reported by user"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-row gap-2 sm:flex-col sm:min-w-[110px]">
              <form
                action={resolveReport.bind(
                  null,
                  report.id,
                  report.target_type,
                  report.target_id,
                  "restored",
                )}
              >
                <Button type="submit" size="sm" variant="outline" className="w-full">
                  Restore
                </Button>
              </form>
              <form
                action={resolveReport.bind(
                  null,
                  report.id,
                  report.target_type,
                  report.target_id,
                  "removed",
                )}
              >
                <Button
                  type="submit"
                  size="sm"
                  variant="destructive"
                  className="w-full"
                >
                  Remove
                </Button>
              </form>
              {!isCrisis && content?.user_id && (
                <form action={banUser.bind(null, content.user_id)}>
                  <Button
                    type="submit"
                    size="sm"
                    variant="destructive"
                    className="w-full"
                  >
                    Ban user
                  </Button>
                </form>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function UsersList() {
  const supabase = await createClient();

  const [{ data: profiles, error }, { data: emails, error: emailsError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, display_name, is_banned, gospel_invite_shown_at, gospel_prayer_at",
        )
        .order("display_name", { ascending: true })
        .returns<ProfileRow[]>(),
      supabase
        .from("profile_emails")
        .select("id, email")
        .returns<ProfileEmailRow[]>(),
    ]);

  if (error) {
    console.error("Failed to load users", error);
  }
  if (emailsError) {
    console.error("Failed to load user emails", emailsError);
  }

  const emailById = new Map((emails ?? []).map((e) => [e.id, e.email]));
  const rows = profiles ?? [];
  const prayedCount = rows.filter((p) => p.gospel_prayer_at).length;
  const maybeLaterCount = rows.filter(
    (p) => p.gospel_invite_shown_at && !p.gospel_prayer_at,
  ).length;
  const notYetShownCount = rows.length - prayedCount - maybeLaterCount;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{prayedCount}</p>
          <p className="text-xs text-muted-foreground">Prayed</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {maybeLaterCount}
          </p>
          <p className="text-xs text-muted-foreground">Maybe later</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {notYetShownCount}
          </p>
          <p className="text-xs text-muted-foreground">Not yet asked</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="p-3 font-normal">Name</th>
              <th className="p-3 font-normal">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      name={p.display_name}
                      className="size-7 text-[10px]"
                    />
                    <div>
                      <div>{p.display_name ?? "(no name)"}</div>
                      {emailById.get(p.id) && (
                        <div className="text-xs text-muted-foreground">
                          {emailById.get(p.id)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant={p.is_banned ? "destructive" : "secondary"}>
                    {p.is_banned ? "Banned" : "Active"}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <form
                    action={(p.is_banned ? unbanUser : banUser).bind(
                      null,
                      p.id,
                    )}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      variant={p.is_banned ? "outline" : "destructive"}
                    >
                      {p.is_banned ? "Unban" : "Ban"}
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function DevotionsAdmin({ editId }: { editId: string | undefined }) {
  const supabase = await createClient();

  const { data: devotions, error } = await supabase
    .from("devotions")
    .select(
      "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
    )
    .order("created_at", { ascending: false })
    .returns<DevotionRow[]>();

  if (error) {
    console.error("Failed to load devotions", error);
  }

  const rows = devotions ?? [];
  const editing = editId ? rows.find((d) => d.id === editId) : undefined;

  const drafts = rows.filter((d) => getDevotionStatus(d.publish_date) === "draft");
  const scheduled = rows.filter(
    (d) => getDevotionStatus(d.publish_date) === "scheduled",
  );
  const published = rows.filter(
    (d) => getDevotionStatus(d.publish_date) === "published",
  );

  return (
    <div className="space-y-6">
      <form
        action={
          editing ? updateDevotion.bind(null, editing.id) : createDevotion
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? "Edit devotion" : "New devotion"}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={editing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scripture_reference">
            Scripture reference (optional)
          </Label>
          <Input
            id="scripture_reference"
            name="scripture_reference"
            placeholder="e.g. Proverbs 3:5-6"
            defaultValue={editing?.scripture_reference ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            name="body"
            rows={5}
            defaultValue={editing?.body}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reflection">Reflection (optional)</Label>
          <Textarea
            id="reflection"
            name="reflection"
            rows={3}
            defaultValue={editing?.reflection ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prayer">Prayer (optional)</Label>
          <Textarea
            id="prayer"
            name="prayer"
            rows={3}
            defaultValue={editing?.prayer ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="practice">Practice (optional)</Label>
          <Textarea
            id="practice"
            name="practice"
            rows={3}
            defaultValue={editing?.practice ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publish_date">
            Publish date (leave blank to save as a draft)
          </Label>
          <Input
            id="publish_date"
            name="publish_date"
            type="date"
            defaultValue={editing?.publish_date ?? ""}
          />
        </div>
        <div className="flex justify-end gap-2">
          {editing && (
            <Button
              render={<Link href="/admin?tab=devotions" />}
              nativeButton={false}
              type="button"
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? "Save changes" : "Create devotion"}
          </Button>
        </div>
      </form>

      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Sparkles className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No devotions yet — write the first one above.
          </p>
        </div>
      )}

      {(
        [
          ["Drafts", drafts],
          ["Scheduled", scheduled],
          ["Published", published],
        ] as const
      ).map(
        ([label, group]) =>
          group.length > 0 && (
            <div key={label} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label} — {group.length}
              </p>
              <div className="divide-y rounded-xl border bg-card">
                {group.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.publish_date ?? "No date yet"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        render={
                          <Link href={`/admin?tab=devotions&edit=${d.id}`} />
                        }
                        nativeButton={false}
                        size="xs"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <form action={deleteDevotion.bind(null, d.id)}>
                        <Button type="submit" size="xs" variant="ghost">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}

const BOOK_STATUS_LABEL: Record<string, string> = {
  pending_review: "Pending Review",
  changes_requested: "Changes Requested",
  rejected: "Rejected",
  approved: "Approved",
  published: "Published",
  unpublished: "Unpublished",
};

async function BooksAdmin() {
  const supabase = await createClient();

  const [{ data: applications }, { data: books }] = await Promise.all([
    supabase
      .from("author_applications")
      .select("id, user_id, bio, reason, website, status, profiles(display_name)")
      .in("status", ["pending", "more_info_requested"])
      .order("created_at", { ascending: true })
      .returns<AuthorApplicationRow[]>(),
    supabase
      .from("books")
      .select(
        "id, author_id, title, description, categories, price_cents, status, manuscript_path, cover_path, profiles(display_name)",
      )
      .neq("status", "draft")
      .order("created_at", { ascending: true })
      .returns<BookRow[]>(),
  ]);

  const bookRows = books ?? [];
  const pendingReview = bookRows.filter((b) => b.status === "pending_review");
  const approved = bookRows.filter((b) => b.status === "approved");
  const published = bookRows.filter((b) => b.status === "published");
  const unpublished = bookRows.filter((b) => b.status === "unpublished");
  const other = bookRows.filter(
    (b) =>
      !["pending_review", "approved", "published", "unpublished"].includes(
        b.status,
      ),
  );

  const coverUrl = (path: string | null) =>
    path ? supabase.storage.from("book-covers").getPublicUrl(path).data.publicUrl : null;

  const manuscriptUrls = new Map<string, string>();
  await Promise.all(
    pendingReview
      .filter((b) => b.manuscript_path)
      .map(async (b) => {
        const { data } = await supabase.storage
          .from("book-manuscripts")
          .createSignedUrl(b.manuscript_path as string, 600);
        if (data?.signedUrl) {
          manuscriptUrls.set(b.id, data.signedUrl);
        }
      }),
  );

  return (
    <div className="space-y-6">
      {(applications ?? []).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Author applications — {(applications ?? []).length}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {(applications ?? []).map((app) => (
              <div key={app.id} className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <Users2 className="size-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">
                    {app.profiles?.display_name ?? "(no name)"}
                  </p>
                  <Badge variant="secondary">
                    {app.status === "more_info_requested"
                      ? "More info requested"
                      : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Bio: </span>
                  {app.bio}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Why: </span>
                  {app.reason}
                </p>
                {app.website && (
                  <p className="text-sm text-muted-foreground">
                    {app.website}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <form
                    action={approveAuthorApplication.bind(
                      null,
                      app.id,
                      app.user_id,
                    )}
                  >
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form
                    action={requestAuthorInfo.bind(null, app.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder="What's missing?"
                      className="h-8 w-40"
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Request info
                    </Button>
                  </form>
                  <form
                    action={rejectAuthorApplication.bind(null, app.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder="Reason (optional)"
                      className="h-8 w-40"
                    />
                    <Button type="submit" size="sm" variant="destructive">
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingReview.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Book submissions — {pendingReview.length}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {pendingReview.map((b) => (
              <div key={b.id} className="space-y-2 p-4">
                <div className="flex gap-3">
                  {coverUrl(b.cover_path) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverUrl(b.cover_path) ?? undefined}
                      alt=""
                      className="size-16 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold">{b.title}</p>
                    <p className="text-xs text-muted-foreground">
                      by {b.profiles?.display_name ?? "(no name)"} ·{" "}
                      {b.price_cents
                        ? `$${(b.price_cents / 100).toFixed(2)}`
                        : "Free"}
                    </p>
                    <p className="text-sm">{b.description}</p>
                    {b.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {b.categories.map((c) => (
                          <Badge key={c} variant="outline">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {manuscriptUrls.has(b.id) && (
                      <a
                        href={manuscriptUrls.get(b.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary underline"
                      >
                        Preview manuscript
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <form action={approveBook.bind(null, b.id)}>
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form
                    action={requestBookChanges.bind(null, b.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder="What needs to change?"
                      className="h-8 w-48"
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Request changes
                    </Button>
                  </form>
                  <form
                    action={rejectBook.bind(null, b.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder="Reason (optional)"
                      className="h-8 w-40"
                    />
                    <Button type="submit" size="sm" variant="destructive">
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Approved — {approved.length}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {approved.map((b) => (
              <BookAdminRow key={b.id} book={b}>
                <form action={publishBook.bind(null, b.id)}>
                  <Button type="submit" size="xs">
                    Publish
                  </Button>
                </form>
              </BookAdminRow>
            ))}
          </div>
        </div>
      )}

      {published.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Published — {published.length}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {published.map((b) => (
              <BookAdminRow key={b.id} book={b}>
                <form action={unpublishBook.bind(null, b.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    Unpublish
                  </Button>
                </form>
              </BookAdminRow>
            ))}
          </div>
        </div>
      )}

      {unpublished.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Unpublished — {unpublished.length}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {unpublished.map((b) => (
              <BookAdminRow key={b.id} book={b}>
                <form action={publishBook.bind(null, b.id)}>
                  <Button type="submit" size="xs">
                    Publish
                  </Button>
                </form>
              </BookAdminRow>
            ))}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Other
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {other.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 p-3">
                <p className="truncate text-sm font-medium">{b.title}</p>
                <Badge variant="secondary">{BOOK_STATUS_LABEL[b.status]}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {(applications ?? []).length === 0 && bookRows.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <BookOpen className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No author applications or book submissions yet.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Row shared by the Approved/Published/Unpublished book lists — every one
 * of them needs the price editable inline, since price is what decides
 * whether "Read now" even works for a reader (see getReadableManuscript).
 */
function BookAdminRow({
  book,
  children,
}: {
  book: BookRow;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{book.title}</p>
        <p className="text-xs text-muted-foreground">
          {book.price_cents ? `$${(book.price_cents / 100).toFixed(2)}` : "Free"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <form
          action={updateBookPrice.bind(null, book.id)}
          className="flex items-center gap-1.5"
        >
          <Input
            name="price_usd"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            defaultValue={
              book.price_cents ? (book.price_cents / 100).toFixed(2) : ""
            }
            className="h-8 w-20"
          />
          <Button type="submit" size="xs" variant="outline">
            Set price
          </Button>
        </form>
        {children}
      </div>
    </div>
  );
}

async function ChurchesAdmin({ editId }: { editId: string | undefined }) {
  const supabase = await createClient();

  const { data: churches, error } = await supabase
    .from("churches")
    .select(
      "id, name, lead_pastor, mission, address, service_time, phone, email, member_count_estimate",
    )
    .order("name", { ascending: true })
    .returns<ChurchRow[]>();

  if (error) {
    console.error("Failed to load churches", error);
  }

  const rows = churches ?? [];
  const editing = editId ? rows.find((c) => c.id === editId) : undefined;

  return (
    <div className="space-y-6">
      <BackLink href="/admin" label="Admin" />
      <form
        action={
          editing ? updateChurch.bind(null, editing.id) : createChurch
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? "Edit church" : "New church"}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="name">Church name</Label>
          <Input id="name" name="name" defaultValue={editing?.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lead_pastor">Lead Pastor</Label>
          <Input
            id="lead_pastor"
            name="lead_pastor"
            defaultValue={editing?.lead_pastor ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mission">Why do they exist?</Label>
          <Textarea
            id="mission"
            name="mission"
            rows={3}
            defaultValue={editing?.mission ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={editing?.address ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="service_time">Service time</Label>
          <Input
            id="service_time"
            name="service_time"
            placeholder="e.g. 0800-0930"
            defaultValue={editing?.service_time ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={editing?.phone ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={editing?.email ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="member_count_estimate">
            Estimated number of members
          </Label>
          <Input
            id="member_count_estimate"
            name="member_count_estimate"
            type="number"
            min="0"
            defaultValue={editing?.member_count_estimate ?? ""}
          />
        </div>
        <div className="flex justify-end gap-2">
          {editing && (
            <Button
              render={<Link href="/admin?tab=churches" />}
              nativeButton={false}
              type="button"
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? "Save changes" : "Create church"}
          </Button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Church className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No churches yet — add the first one above.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {rows.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.lead_pastor ?? "No pastor listed"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  render={<Link href={`/admin?tab=churches&edit=${c.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  Edit
                </Button>
                <form action={deleteChurch.bind(null, c.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function OpportunitiesAdmin({
  editId,
}: {
  editId: string | undefined;
}) {
  const supabase = await createClient();

  const { data: opportunities, error } = await supabase
    .from("service_opportunities")
    .select(
      "id, title, category, description, location, contact_email, contact_phone, link, status",
    )
    .order("created_at", { ascending: false })
    .returns<OpportunityRow[]>();

  if (error) {
    console.error("Failed to load service opportunities", error);
  }

  const rows = opportunities ?? [];
  const editing = editId ? rows.find((o) => o.id === editId) : undefined;

  return (
    <div className="space-y-6">
      <BackLink href="/admin" label="Admin" />
      <form
        action={
          editing
            ? updateServiceOpportunity.bind(null, editing.id)
            : createServiceOpportunity
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? "Edit opportunity" : "New opportunity"}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={editing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            placeholder="e.g. Volunteering, Missions, Outreach"
            defaultValue={editing?.category ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={editing?.description ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={editing?.location ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_email">Contact email</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={editing?.contact_email ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">Contact phone</Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            defaultValue={editing?.contact_phone ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link">Link (optional)</Label>
          <Input
            id="link"
            name="link"
            placeholder="https://"
            defaultValue={editing?.link ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={editing?.status ?? "draft"}
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          {editing && (
            <Button
              render={<Link href="/admin?tab=opportunities" />}
              nativeButton={false}
              type="button"
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? "Save changes" : "Create opportunity"}
          </Button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <HeartHandshake className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No opportunities yet — add the first one above.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {rows.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">{o.title}</p>
                  <Badge variant={o.status === "published" ? "default" : "secondary"}>
                    {o.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {o.category ?? "No category"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  render={<Link href={`/admin?tab=opportunities&edit=${o.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  Edit
                </Button>
                <form action={deleteServiceOpportunity.bind(null, o.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PRAYER_POINT_SUGGESTIONS = [
  "Pray for open doors for the gospel",
  "Pray for peace and safety",
  "Pray for the local church there",
  "Pray for provision",
  "Pray for boldness to share Christ",
  "Pray for unity among believers",
  "Pray for protection over families",
  "Pray for revival",
];

async function PrayerMovementsAdmin({
  editId,
}: {
  editId: string | undefined;
}) {
  const supabase = await createClient();

  const { data: movements, error } = await supabase
    .from("prayer_movements")
    .select("id, title, scripture_reference, prayer_points, status, active_until")
    .order("created_at", { ascending: false })
    .returns<PrayerMovementRow[]>();

  if (error) {
    console.error("Failed to load prayer movements", error);
  }

  const rows = movements ?? [];
  const editing = editId ? rows.find((m) => m.id === editId) : undefined;

  const active = rows.filter((m) => m.status === "active");
  const drafts = rows.filter((m) => m.status === "draft");
  const archived = rows.filter((m) => m.status === "archived");

  return (
    <div className="space-y-6">
      <form
        action={
          editing
            ? updatePrayerMovement.bind(null, editing.id)
            : createPrayerMovement
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? "Edit prayer movement" : "New prayer movement"}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Let's pray for Nepal"
            defaultValue={editing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scripture_reference">
            Scripture reference (optional)
          </Label>
          <Input
            id="scripture_reference"
            name="scripture_reference"
            placeholder="e.g. Psalm 67:1-2"
            defaultValue={editing?.scripture_reference ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Prayer points</Label>
          <ChipListInput
            name="prayer_points"
            defaultValue={editing?.prayer_points ?? []}
            suggestions={PRAYER_POINT_SUGGESTIONS}
            placeholder="Type a prayer point, then press Enter"
          />
        </div>
        <div className="flex justify-end gap-2">
          {editing && (
            <Button
              render={<Link href="/admin?tab=prayer" />}
              nativeButton={false}
              type="button"
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? "Save changes" : "Create movement"}
          </Button>
        </div>
      </form>

      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Heart className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No prayer movements yet — create the first one above.
          </p>
        </div>
      )}

      {(
        [
          ["Active", active],
          ["Drafts", drafts],
          ["Archived", archived],
        ] as const
      ).map(
        ([label, group]) =>
          group.length > 0 && (
            <div key={label} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label} — {group.length}
              </p>
              <div className="divide-y rounded-xl border bg-card">
                {group.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.prayer_points.length} prayer point
                        {m.prayer_points.length === 1 ? "" : "s"}
                        {m.status === "active" &&
                          (() => {
                            const daysLeft = getPrayerMovementDaysLeft(
                              m.active_until,
                            );
                            return daysLeft === null
                              ? " · no expiry"
                              : ` · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
                          })()}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                      <Button
                        render={<Link href={`/admin?tab=prayer&edit=${m.id}`} />}
                        nativeButton={false}
                        size="xs"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      {m.status === "active" ? (
                        <form action={archivePrayerMovement.bind(null, m.id)}>
                          <Button type="submit" size="xs" variant="ghost">
                            Archive
                          </Button>
                        </form>
                      ) : (
                        <form
                          action={activatePrayerMovement.bind(null, m.id)}
                          className="flex items-center gap-1"
                        >
                          <Input
                            name="days"
                            type="number"
                            min="1"
                            defaultValue={7}
                            aria-label="Days to run"
                            className="h-6 w-14 px-1.5 text-xs"
                          />
                          <Button type="submit" size="xs">
                            Activate
                          </Button>
                        </form>
                      )}
                      <form action={deletePrayerMovement.bind(null, m.id)}>
                        <Button type="submit" size="xs" variant="ghost">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}

async function JourneysAdmin({
  editId,
  journeyId,
  day,
  publishError,
}: {
  editId: string | undefined;
  journeyId: string | undefined;
  day: string | undefined;
  publishError: string | undefined;
}) {
  const supabase = await createClient();

  const { data: journeys, error } = await supabase
    .from("journeys")
    .select(
      "id, slug, title, purpose, duration_days, completion_title, teaser, status",
    )
    .order("created_at", { ascending: false })
    .returns<JourneyRow[]>();

  if (error) {
    console.error("Failed to load journeys", error);
  }

  const rows = journeys ?? [];
  const selectedJourney = journeyId
    ? rows.find((j) => j.id === journeyId)
    : undefined;

  if (selectedJourney && day) {
    return (
      <JourneyDayEditor journey={selectedJourney} dayNumber={Number(day)} />
    );
  }

  if (selectedJourney) {
    return (
      <JourneyDaysList
        journey={selectedJourney}
        showPublishError={publishError === "missing_days"}
      />
    );
  }

  const editing = editId ? rows.find((j) => j.id === editId) : undefined;

  return (
    <div className="space-y-6">
      <form
        action={
          editing ? updateJourney.bind(null, editing.id) : createJourney
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? "Edit journey" : "New journey"}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="slug">
            Slug (lowercase, hyphenated — used in the URL)
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder="e.g. identity-in-christ"
            defaultValue={editing?.slug}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={editing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="purpose">Purpose</Label>
          <Textarea
            id="purpose"
            name="purpose"
            rows={3}
            defaultValue={editing?.purpose}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="teaser">
            Card teaser (optional — short blurb shown on Home&apos;s
            dashboard cards; falls back to Purpose, trimmed, if left blank)
          </Label>
          <Textarea
            id="teaser"
            name="teaser"
            rows={2}
            defaultValue={editing?.teaser ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration_days">Duration (days)</Label>
          <Input
            id="duration_days"
            name="duration_days"
            type="number"
            min="1"
            defaultValue={editing?.duration_days}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="completion_title">Completion title</Label>
          <Input
            id="completion_title"
            name="completion_title"
            placeholder="e.g. You've taken your first Leap."
            defaultValue={editing?.completion_title}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          {editing && (
            <Button
              render={<Link href="/admin?tab=journeys" />}
              nativeButton={false}
              type="button"
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? "Save changes" : "Create journey"}
          </Button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Compass className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No admin-authored journeys yet — &ldquo;Faith in Christ&rdquo;
            remains available to every user as the built-in onboarding
            journey.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {rows.map((j) => (
            <div key={j.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">{j.title}</p>
                  <Badge variant={j.status === "published" ? "default" : "secondary"}>
                    {j.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {j.duration_days} days &middot; /{j.slug}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                <Button
                  render={<Link href={`/admin?tab=journeys&journey=${j.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  Edit days
                </Button>
                <Button
                  render={<Link href={`/admin?tab=journeys&edit=${j.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  Edit
                </Button>
                {j.status === "published" ? (
                  <form action={unpublishJourney.bind(null, j.id)}>
                    <Button type="submit" size="xs" variant="ghost">
                      Unpublish
                    </Button>
                  </form>
                ) : (
                  <form action={publishJourney.bind(null, j.id)}>
                    <Button type="submit" size="xs">
                      Publish
                    </Button>
                  </form>
                )}
                <form action={deleteJourney.bind(null, j.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function JourneyDaysList({
  journey,
  showPublishError,
}: {
  journey: JourneyRow;
  showPublishError: boolean;
}) {
  const supabase = await createClient();

  const { data: days, error } = await supabase
    .from("journey_days")
    .select("day_number")
    .eq("journey_id", journey.id)
    .returns<{ day_number: number }[]>();

  if (error) {
    console.error("Failed to load journey days", error);
  }

  const writtenDays = new Set((days ?? []).map((d) => d.day_number));
  const dayNumbers = Array.from(
    { length: journey.duration_days },
    (_, i) => i + 1,
  );
  const missingDays = dayNumbers.filter((n) => !writtenDays.has(n));
  const allWritten = missingDays.length === 0;

  return (
    <div className="space-y-4">
      {showPublishError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Can&apos;t publish yet — Day{missingDays.length > 1 ? "s" : ""}{" "}
          {missingDays.join(", ")} {missingDays.length > 1 ? "are" : "is"}{" "}
          still missing. Write every day, then publish.
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{journey.title}</p>
          <p className="text-xs text-muted-foreground">
            {writtenDays.size} of {journey.duration_days} days written
            {!allWritten ? " — finish every day before publishing" : ""}
          </p>
        </div>
        <Button
          render={<Link href="/admin?tab=journeys" />}
          nativeButton={false}
          size="sm"
          variant="ghost"
        >
          Back to journeys
        </Button>
      </div>

      <div className="divide-y rounded-xl border bg-card">
        {dayNumbers.map((n) => (
          <div key={n} className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Day {n}</p>
              <Badge variant={writtenDays.has(n) ? "default" : "secondary"}>
                {writtenDays.has(n) ? "Written" : "Missing"}
              </Badge>
            </div>
            <Button
              render={
                <Link href={`/admin?tab=journeys&journey=${journey.id}&day=${n}`} />
              }
              nativeButton={false}
              size="xs"
              variant="outline"
            >
              {writtenDays.has(n) ? "Edit" : "Write"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

const JOURNEY_DAY_SUGGESTIONS = {
  message: [
    "Today we're looking at...",
    "In this passage, we see...",
    "This changes everything because...",
  ],
  explore: [
    "Read the passage slowly, twice.",
    "What stands out to you here?",
    "Who is speaking, and who are they speaking to?",
  ],
  reflect: [
    "How does this truth change the way you see...?",
    "Where do you need to apply this today?",
    "What is one step you can take because of this?",
  ],
  pray: [
    "Thank You, Lord, for...",
    "Help me to...",
    "I confess that...",
    "Give me courage to...",
  ],
} as const;

async function JourneyDayEditor({
  journey,
  dayNumber,
}: {
  journey: JourneyRow;
  dayNumber: number;
}) {
  const supabase = await createClient();

  const { data: existing, error } = await supabase
    .from("journey_days")
    .select(
      "day_number, title, scripture_reference, message, explore, reflect, pray, next_topic",
    )
    .eq("journey_id", journey.id)
    .eq("day_number", dayNumber)
    .maybeSingle<JourneyDayRow>();

  if (error) {
    console.error("Failed to load journey day", error);
  }

  const backHref = `/admin?tab=journeys&journey=${journey.id}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">
          {journey.title} &middot; Day {dayNumber}
        </p>
        <Button
          render={<Link href={backHref} />}
          nativeButton={false}
          size="sm"
          variant="ghost"
        >
          Back to days
        </Button>
      </div>

      <form
        action={saveJourneyDay.bind(null, journey.id, dayNumber)}
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={existing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scripture_reference">Scripture reference</Label>
          <Input
            id="scripture_reference"
            name="scripture_reference"
            placeholder="e.g. Romans 6:1-11"
            defaultValue={existing?.scripture_reference}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="message">Message</Label>
          <SuggestibleTextarea
            id="message"
            name="message"
            rows={4}
            defaultValue={existing?.message}
            required
            suggestions={JOURNEY_DAY_SUGGESTIONS.message}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="explore">Explore</Label>
          <SuggestibleTextarea
            id="explore"
            name="explore"
            rows={3}
            defaultValue={existing?.explore}
            required
            suggestions={JOURNEY_DAY_SUGGESTIONS.explore}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reflect">Reflect</Label>
          <SuggestibleTextarea
            id="reflect"
            name="reflect"
            rows={3}
            defaultValue={existing?.reflect}
            required
            suggestions={JOURNEY_DAY_SUGGESTIONS.reflect}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pray">Pray (optional)</Label>
          <SuggestibleTextarea
            id="pray"
            name="pray"
            rows={2}
            defaultValue={existing?.pray ?? ""}
            suggestions={JOURNEY_DAY_SUGGESTIONS.pray}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="next_topic">Next topic teaser (optional)</Label>
          <Input
            id="next_topic"
            name="next_topic"
            defaultValue={existing?.next_topic ?? ""}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            render={<Link href={backHref} />}
            nativeButton={false}
            type="button"
            variant="ghost"
            size="sm"
          >
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Save day
          </Button>
        </div>
      </form>
    </div>
  );
}
