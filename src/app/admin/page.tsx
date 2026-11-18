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
  TrendingUp,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/back-link";
import { PatternCorner } from "@/components/pattern-bg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuggestibleTextarea } from "@/components/admin/suggestible-textarea";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/authorize";
import { getAdminNotificationCounts } from "@/lib/supabase/admin-notifications";
import { COUNTRIES, countryFlag } from "@/lib/countries";
import { getDevotionStatus } from "@/lib/devotion";
import {
  getAnnouncementDaysLeft,
  getAnnouncementImageUrl,
  type AnnouncementKind,
} from "@/lib/supabase/announcements";
import { AnnouncementFields } from "@/components/admin/announcement-fields";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { formatDate, interpolate, plural } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/locales";
import type { AdminMessages } from "@/lib/i18n/messages/en/admin";
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
  setPdTeamMember,
  unpublishBook,
  updateBookPrice,
  updateChurch,
  updateDevotion,
  updateServiceOpportunity,
  createAnnouncement,
  updateAnnouncement,
  activateAnnouncement,
  archiveAnnouncement,
  deleteAnnouncement,
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
  | "prayer"
  | "reports";

type ReportPeriod = "month" | "quarter" | "year";

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
  role: string;
  is_banned: boolean;
  gospel_invite_shown_at: string | null;
  gospel_prayer_at: string | null;
};

type ProfileEmailRow = {
  id: string;
  email: string;
  nationality: string | null;
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

type AnnouncementRow = {
  id: string;
  kind: AnnouncementKind;
  title: string;
  body: string | null;
  image_path: string | null;
  link_url: string | null;
  link_label: string | null;
  event_date: string | null;
  scripture_reference: string | null;
  prayer_points: string[];
  status: string;
  active_until: string | null;
};

type EngagementReportRow = {
  new_signups: number;
  active_users: number;
  sessions_completed: number;
  journeys_started: number;
  journeys_completed: number;
  commitments_created: number;
  commitments_completed: number;
  prayer_requests_count: number;
  posts_count: number;
  comments_count: number;
  companion_messages_count: number;
  gospel_prayers_count: number;
};

// When app_visits (0033_usage_report.sql) started recording daily opens.
const USAGE_TRACKING_SINCE = "2026-10-17";

type UsageReportRow = {
  total_users: number;
  users_in_period: number;
  regular_users: number;
  devotion_readers: number;
  reminder_subscribers: number;
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
                  : tabParam === "reports"
                    ? "reports"
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
  const periodParam = Array.isArray(searchParams.period)
    ? searchParams.period[0]
    : searchParams.period;
  const period: ReportPeriod =
    periodParam === "quarter" ? "quarter" : periodParam === "year" ? "year" : "month";

  await requireAdmin();
  const t = getDictionary(await getLocale()).admin;

  const supabase = await createClient();
  const { openReportsCount, pendingApplicationsCount, pendingBooksCount } =
    await getAdminNotificationCounts(supabase);

  const booksNotificationCount =
    (pendingApplicationsCount ?? 0) + (pendingBooksCount ?? 0);

  return (
    <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternCorner corner="top-right" />
      <BackLink href="/" label={t.page.home} />
      <h1 className="text-2xl font-heading font-semibold">{t.page.heading}</h1>

      <div className="-mx-6 flex gap-4 overflow-x-auto border-b px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/admin"
          className={
            tab === "queue"
              ? "flex shrink-0 items-center gap-1.5 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "flex shrink-0 items-center gap-1.5 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          {t.page.tabs.queue}
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
          {t.page.tabs.users}
        </Link>
        <Link
          href="/admin?tab=devotions"
          className={
            tab === "devotions"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          {t.page.tabs.devotions}
        </Link>
        <Link
          href="/admin?tab=books"
          className={
            tab === "books"
              ? "flex shrink-0 items-center gap-1.5 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "flex shrink-0 items-center gap-1.5 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          {t.page.tabs.books}
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
          {t.page.tabs.churches}
        </Link>
        <Link
          href="/admin?tab=journeys"
          className={
            tab === "journeys"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          {t.page.tabs.journeys}
        </Link>
        <Link
          href="/admin?tab=opportunities"
          className={
            tab === "opportunities"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          {t.page.tabs.opportunities}
        </Link>
        <Link
          href="/ask-pd/inbox"
          className="shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
        >
          {t.page.tabs.askPd}
        </Link>
        <Link
          href="/admin?tab=prayer"
          className={
            tab === "prayer"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          {t.page.tabs.announcements}
        </Link>
        <Link
          href="/admin/translations"
          className="shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
        >
          {t.page.tabs.translations}
        </Link>
        <Link
          href="/admin?tab=reports"
          className={
            tab === "reports"
              ? "shrink-0 rounded-t-md border-b-2 border-primary px-2 -mx-2 pb-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:shadow-sm"
              : "shrink-0 rounded-t-md px-2 -mx-2 pb-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:shadow-sm"
          }
        >
          {t.page.tabs.reports}
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
        <AnnouncementsAdmin editId={editIdParam} />
      ) : tab === "reports" ? (
        <ReportsAdmin period={period} />
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
  const t = getDictionary(await getLocale()).admin;

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
        <p className="text-sm text-muted-foreground">{t.moderation.empty}</p>
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
                  {interpolate(t.moderation.reported, {
                    type:
                      t.moderation.targetTypes[report.target_type] ??
                      report.target_type.replace("_", " "),
                  })}
                  {content?.profiles?.display_name
                    ? ` · ${content.profiles.display_name}`
                    : ""}
                </p>
                <p className="text-sm">
                  {content?.body ?? t.moderation.contentUnavailable}
                </p>
                <Badge variant={isCrisis ? "secondary" : "destructive"}>
                  {isCrisis
                    ? t.moderation.autoFlagged
                    : t.moderation.reportedByUser}
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
                  {t.moderation.restore}
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
                  {t.moderation.remove}
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
                    {t.moderation.banUser}
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
  const t = getDictionary(await getLocale()).admin;

  const [{ data: profiles, error }, { data: emails, error: emailsError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, display_name, role, is_banned, gospel_invite_shown_at, gospel_prayer_at",
        )
        .order("display_name", { ascending: true })
        .returns<ProfileRow[]>(),
      supabase
        .from("profile_emails")
        .select("id, email, nationality")
        .returns<ProfileEmailRow[]>(),
    ]);

  if (error) {
    console.error("Failed to load users", error);
  }
  if (emailsError) {
    console.error("Failed to load user emails", emailsError);
  }

  const emailById = new Map((emails ?? []).map((e) => [e.id, e.email]));
  const nationalityById = new Map(
    (emails ?? []).map((e) => [e.id, e.nationality]),
  );
  const countryNameByCode = new Map(COUNTRIES.map((c) => [c.code, c.name]));
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
          <p className="text-xs text-muted-foreground">{t.users.prayed}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {maybeLaterCount}
          </p>
          <p className="text-xs text-muted-foreground">{t.users.maybeLater}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {notYetShownCount}
          </p>
          <p className="text-xs text-muted-foreground">{t.users.notYetAsked}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-start text-xs text-muted-foreground">
              <th className="p-3 font-normal">{t.users.name}</th>
              <th className="p-3 font-normal">{t.users.status}</th>
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
                      <div>{p.display_name ?? t.shared.noName}</div>
                      {emailById.get(p.id) && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>{emailById.get(p.id)}</span>
                          {nationalityById.get(p.id) && (
                            <span
                              title={
                                countryNameByCode.get(
                                  nationalityById.get(p.id)!,
                                ) ?? nationalityById.get(p.id)!
                              }
                            >
                              {countryFlag(nationalityById.get(p.id)!)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={p.is_banned ? "destructive" : "secondary"}>
                      {p.is_banned ? t.users.banned : t.users.active}
                    </Badge>
                    {p.role === "admin" && <Badge>{t.users.admin}</Badge>}
                    {p.role === "pastor" && <Badge>{t.users.pdTeam}</Badge>}
                  </div>
                </td>
                <td className="p-3 text-end">
                  <div className="flex flex-col items-end gap-1.5">
                  {p.role !== "admin" && !p.is_banned && (
                    <form action={setPdTeamMember.bind(null, p.id, p.role !== "pastor")}>
                      <Button type="submit" size="sm" variant="outline">
                        {p.role === "pastor" ? t.users.removeFromPdTeam : t.users.addToPdTeam}
                      </Button>
                    </form>
                  )}
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
                      {p.is_banned ? t.users.unban : t.users.ban}
                    </Button>
                  </form>
                  </div>
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
  const t = getDictionary(await getLocale()).admin;

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
          {editing ? t.devotions.editHeading : t.devotions.newHeading}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="title">{t.shared.title}</Label>
          <Input
            id="title"
            name="title"
            defaultValue={editing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scripture_reference">
            {t.shared.scriptureReferenceOptional}
          </Label>
          <Input
            id="scripture_reference"
            name="scripture_reference"
            placeholder={t.devotions.scripturePlaceholder}
            defaultValue={editing?.scripture_reference ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="body">{t.devotions.body}</Label>
          <Textarea
            id="body"
            name="body"
            rows={5}
            defaultValue={editing?.body}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reflection">{t.devotions.reflectionOptional}</Label>
          <Textarea
            id="reflection"
            name="reflection"
            rows={3}
            defaultValue={editing?.reflection ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prayer">{t.devotions.prayerOptional}</Label>
          <Textarea
            id="prayer"
            name="prayer"
            rows={3}
            defaultValue={editing?.prayer ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="practice">{t.devotions.practiceOptional}</Label>
          <Textarea
            id="practice"
            name="practice"
            rows={3}
            defaultValue={editing?.practice ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publish_date">
            {t.devotions.publishDate}
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
              {t.shared.cancel}
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? t.shared.saveChanges : t.devotions.create}
          </Button>
        </div>
      </form>

      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Sparkles className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.devotions.empty}
          </p>
        </div>
      )}

      {(
        [
          [t.devotions.drafts, drafts],
          [t.devotions.scheduled, scheduled],
          [t.devotions.published, published],
        ] as const
      ).map(
        ([label, group]) =>
          group.length > 0 && (
            <div key={label} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {interpolate(t.shared.groupHeading, {
                  label,
                  count: group.length,
                })}
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
                        {d.publish_date ?? t.devotions.noDate}
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
                        {t.shared.edit}
                      </Button>
                      <form action={deleteDevotion.bind(null, d.id)}>
                        <Button type="submit" size="xs" variant="ghost">
                          {t.shared.delete}
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

async function BooksAdmin() {
  const supabase = await createClient();
  const t = getDictionary(await getLocale()).admin;

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
            {interpolate(t.shared.groupHeading, {
              label: t.books.authorApplications,
              count: (applications ?? []).length,
            })}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {(applications ?? []).map((app) => (
              <div key={app.id} className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <Users2 className="size-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">
                    {app.profiles?.display_name ?? t.shared.noName}
                  </p>
                  <Badge variant="secondary">
                    {app.status === "more_info_requested"
                      ? t.books.moreInfoRequested
                      : t.books.pending}
                  </Badge>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">{t.books.bio}</span>
                  {app.bio}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">{t.books.why}</span>
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
                      {t.books.approve}
                    </Button>
                  </form>
                  <form
                    action={requestAuthorInfo.bind(null, app.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder={t.books.whatsMissing}
                      className="h-8 w-40"
                    />
                    <Button type="submit" size="sm" variant="outline">
                      {t.books.requestInfo}
                    </Button>
                  </form>
                  <form
                    action={rejectAuthorApplication.bind(null, app.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder={t.books.reasonOptional}
                      className="h-8 w-40"
                    />
                    <Button type="submit" size="sm" variant="destructive">
                      {t.books.reject}
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
            {interpolate(t.shared.groupHeading, {
              label: t.books.bookSubmissions,
              count: pendingReview.length,
            })}
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
                      {interpolate(t.books.byAuthor, {
                        name: b.profiles?.display_name ?? t.shared.noName,
                      })}{" "}
                      ·{" "}
                      {b.price_cents
                        ? `$${(b.price_cents / 100).toFixed(2)}`
                        : t.books.free}
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
                        {t.books.previewManuscript}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <form action={approveBook.bind(null, b.id)}>
                    <Button type="submit" size="sm">
                      {t.books.approve}
                    </Button>
                  </form>
                  <form
                    action={requestBookChanges.bind(null, b.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder={t.books.whatNeedsToChange}
                      className="h-8 w-48"
                    />
                    <Button type="submit" size="sm" variant="outline">
                      {t.books.requestChanges}
                    </Button>
                  </form>
                  <form
                    action={rejectBook.bind(null, b.id)}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="review_notes"
                      placeholder={t.books.reasonOptional}
                      className="h-8 w-40"
                    />
                    <Button type="submit" size="sm" variant="destructive">
                      {t.books.reject}
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
            {interpolate(t.shared.groupHeading, {
              label: t.books.approved,
              count: approved.length,
            })}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {approved.map((b) => (
              <BookAdminRow key={b.id} book={b} t={t}>
                <form action={publishBook.bind(null, b.id)}>
                  <Button type="submit" size="xs">
                    {t.shared.publish}
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
            {interpolate(t.shared.groupHeading, {
              label: t.books.published,
              count: published.length,
            })}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {published.map((b) => (
              <BookAdminRow key={b.id} book={b} t={t}>
                <form action={unpublishBook.bind(null, b.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    {t.shared.unpublish}
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
            {interpolate(t.shared.groupHeading, {
              label: t.books.unpublished,
              count: unpublished.length,
            })}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {unpublished.map((b) => (
              <BookAdminRow key={b.id} book={b} t={t}>
                <form action={publishBook.bind(null, b.id)}>
                  <Button type="submit" size="xs">
                    {t.shared.publish}
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
            {t.books.other}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {other.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 p-3">
                <p className="truncate text-sm font-medium">{b.title}</p>
                <Badge variant="secondary">{t.books.statusLabels[b.status]}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {(applications ?? []).length === 0 && bookRows.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <BookOpen className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.books.empty}
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
  t,
  children,
}: {
  book: BookRow;
  t: AdminMessages;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{book.title}</p>
        <p className="text-xs text-muted-foreground">
          {book.price_cents ? `$${(book.price_cents / 100).toFixed(2)}` : t.books.free}
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
            {t.books.setPrice}
          </Button>
        </form>
        {children}
      </div>
    </div>
  );
}

async function ChurchesAdmin({ editId }: { editId: string | undefined }) {
  const supabase = await createClient();
  const t = getDictionary(await getLocale()).admin;

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
      <BackLink href="/admin" label={t.shared.backToAdmin} />
      <form
        action={
          editing ? updateChurch.bind(null, editing.id) : createChurch
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? t.churches.editHeading : t.churches.newHeading}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="name">{t.churches.name}</Label>
          <Input id="name" name="name" defaultValue={editing?.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lead_pastor">{t.churches.leadPastor}</Label>
          <Input
            id="lead_pastor"
            name="lead_pastor"
            defaultValue={editing?.lead_pastor ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mission">{t.churches.mission}</Label>
          <Textarea
            id="mission"
            name="mission"
            rows={3}
            defaultValue={editing?.mission ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">{t.churches.address}</Label>
          <Input
            id="address"
            name="address"
            defaultValue={editing?.address ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="service_time">{t.churches.serviceTime}</Label>
          <Input
            id="service_time"
            name="service_time"
            placeholder={t.churches.serviceTimePlaceholder}
            defaultValue={editing?.service_time ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t.churches.phone}</Label>
          <Input id="phone" name="phone" defaultValue={editing?.phone ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t.churches.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={editing?.email ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="member_count_estimate">
            {t.churches.memberCount}
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
              {t.shared.cancel}
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? t.shared.saveChanges : t.churches.create}
          </Button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Church className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.churches.empty}
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card">
          {rows.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.lead_pastor ?? t.churches.noPastor}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  render={<Link href={`/admin?tab=churches&edit=${c.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  {t.shared.edit}
                </Button>
                <form action={deleteChurch.bind(null, c.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    {t.shared.delete}
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
  const t = getDictionary(await getLocale()).admin;

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
      <BackLink href="/admin" label={t.shared.backToAdmin} />
      <form
        action={
          editing
            ? updateServiceOpportunity.bind(null, editing.id)
            : createServiceOpportunity
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? t.opportunities.editHeading : t.opportunities.newHeading}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="title">{t.shared.title}</Label>
          <Input
            id="title"
            name="title"
            defaultValue={editing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">{t.opportunities.category}</Label>
          <Input
            id="category"
            name="category"
            placeholder={t.opportunities.categoryPlaceholder}
            defaultValue={editing?.category ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">{t.opportunities.description}</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={editing?.description ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">{t.opportunities.location}</Label>
          <Input
            id="location"
            name="location"
            defaultValue={editing?.location ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_email">{t.opportunities.contactEmail}</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={editing?.contact_email ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">{t.opportunities.contactPhone}</Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            defaultValue={editing?.contact_phone ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link">{t.shared.linkOptional}</Label>
          <Input
            id="link"
            name="link"
            placeholder="https://"
            defaultValue={editing?.link ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">{t.opportunities.status}</Label>
          <select
            id="status"
            name="status"
            defaultValue={editing?.status ?? "draft"}
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          >
            <option value="draft">{t.opportunities.statusOptions.draft}</option>
            <option value="published">
              {t.opportunities.statusOptions.published}
            </option>
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
              {t.shared.cancel}
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? t.shared.saveChanges : t.opportunities.create}
          </Button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <HeartHandshake className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.opportunities.empty}
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
                    {t.opportunities.statusBadges[o.status] ?? o.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {o.category ?? t.opportunities.noCategory}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  render={<Link href={`/admin?tab=opportunities&edit=${o.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  {t.shared.edit}
                </Button>
                <form action={deleteServiceOpportunity.bind(null, o.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    {t.shared.delete}
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

async function AnnouncementsAdmin({
  editId,
}: {
  editId: string | undefined;
}) {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = getDictionary(locale).admin;

  const { data: movements, error } = await supabase
    .from("prayer_movements")
    .select(
      "id, kind, title, body, image_path, link_url, link_label, event_date, scripture_reference, prayer_points, status, active_until",
    )
    .order("created_at", { ascending: false })
    .returns<AnnouncementRow[]>();

  if (error) {
    console.error("Failed to load announcements", error);
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
            ? updateAnnouncement.bind(null, editing.id)
            : createAnnouncement
        }
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <p className="text-sm font-semibold">
          {editing ? t.announcements.editHeading : t.announcements.newHeading}
        </p>
        <p className="text-xs text-muted-foreground">
          {t.announcements.intro}
        </p>
        <AnnouncementFields
          key={editing?.id ?? "new"}
          defaults={editing}
          prayerPointSuggestions={t.announcements.prayerPointSuggestions}
          currentImageUrl={getAnnouncementImageUrl(editing?.image_path ?? null)}
          dict={t.announcementFields}
        />
        <div className="flex justify-end gap-2">
          {editing && (
            <Button
              render={<Link href="/admin?tab=prayer" />}
              nativeButton={false}
              type="button"
              variant="ghost"
              size="sm"
            >
              {t.shared.cancel}
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? t.shared.saveChanges : t.announcements.create}
          </Button>
        </div>
      </form>

      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Heart className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.announcements.empty}
          </p>
        </div>
      )}

      {(
        [
          [t.announcements.active, active],
          [t.announcements.drafts, drafts],
          [t.announcements.archived, archived],
        ] as const
      ).map(
        ([label, group]) =>
          group.length > 0 && (
            <div key={label} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {interpolate(t.shared.groupHeading, {
                  label,
                  count: group.length,
                })}
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
                        {t.announcementFields.kinds[m.kind]}
                        {m.kind === "prayer" &&
                          ` · ${plural(locale, m.prayer_points.length, t.announcements.prayerPoints)}`}
                        {m.kind === "event" &&
                          m.event_date &&
                          ` · ${m.event_date}`}
                        {m.status === "active" &&
                          (() => {
                            const daysLeft = getAnnouncementDaysLeft(
                              m.active_until,
                            );
                            return daysLeft === null
                              ? ` · ${t.announcements.noExpiry}`
                              : ` · ${plural(locale, daysLeft, t.announcements.daysLeft)}`;
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
                        {t.shared.edit}
                      </Button>
                      {m.status === "active" ? (
                        <form action={archiveAnnouncement.bind(null, m.id)}>
                          <Button type="submit" size="xs" variant="ghost">
                            {t.announcements.archive}
                          </Button>
                        </form>
                      ) : (
                        <form
                          action={activateAnnouncement.bind(null, m.id)}
                          className="flex items-center gap-1"
                        >
                          <Input
                            name="days"
                            type="number"
                            min="1"
                            defaultValue={7}
                            aria-label={t.announcements.daysToRun}
                            className="h-6 w-14 px-1.5 text-xs"
                          />
                          <Button type="submit" size="xs">
                            {t.announcements.activate}
                          </Button>
                        </form>
                      )}
                      <form action={deleteAnnouncement.bind(null, m.id)}>
                        <Button type="submit" size="xs" variant="ghost">
                          {t.shared.delete}
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
  const t = getDictionary(await getLocale()).admin;

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
          {editing ? t.journeys.editHeading : t.journeys.newHeading}
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="slug">
            {t.journeys.slug}
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder={t.journeys.slugPlaceholder}
            defaultValue={editing?.slug}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">{t.shared.title}</Label>
          <Input
            id="title"
            name="title"
            defaultValue={editing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="purpose">{t.journeys.purpose}</Label>
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
            {t.journeys.teaser}
          </Label>
          <Textarea
            id="teaser"
            name="teaser"
            rows={2}
            defaultValue={editing?.teaser ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration_days">{t.journeys.duration}</Label>
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
          <Label htmlFor="completion_title">{t.journeys.completionTitle}</Label>
          <Input
            id="completion_title"
            name="completion_title"
            placeholder={t.journeys.completionTitlePlaceholder}
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
              {t.shared.cancel}
            </Button>
          )}
          <Button type="submit" size="sm">
            {editing ? t.shared.saveChanges : t.journeys.create}
          </Button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Compass className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.journeys.empty}
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
                    {j.status === "published" ? t.journeys.published : t.journeys.draft}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {interpolate(t.journeys.meta, {
                    count: j.duration_days,
                    slug: j.slug,
                  })}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                <Button
                  render={<Link href={`/admin?tab=journeys&journey=${j.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  {t.journeys.editDays}
                </Button>
                <Button
                  render={<Link href={`/admin?tab=journeys&edit=${j.id}`} />}
                  nativeButton={false}
                  size="xs"
                  variant="outline"
                >
                  {t.shared.edit}
                </Button>
                {j.status === "published" ? (
                  <form action={unpublishJourney.bind(null, j.id)}>
                    <Button type="submit" size="xs" variant="ghost">
                      {t.shared.unpublish}
                    </Button>
                  </form>
                ) : (
                  <form action={publishJourney.bind(null, j.id)}>
                    <Button type="submit" size="xs">
                      {t.shared.publish}
                    </Button>
                  </form>
                )}
                <form action={deleteJourney.bind(null, j.id)}>
                  <Button type="submit" size="xs" variant="ghost">
                    {t.shared.delete}
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
  const t = getDictionary(await getLocale()).admin;

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
          {interpolate(
            missingDays.length > 1
              ? t.journeyDays.missingMany
              : t.journeyDays.missingOne,
            { days: missingDays.join(", ") },
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{journey.title}</p>
          <p className="text-xs text-muted-foreground">
            {interpolate(t.journeyDays.progress, {
              written: writtenDays.size,
              total: journey.duration_days,
            })}
            {!allWritten ? t.journeyDays.finishEveryDay : ""}
          </p>
        </div>
        <Button
          render={<Link href="/admin?tab=journeys" />}
          nativeButton={false}
          size="sm"
          variant="ghost"
        >
          {t.journeyDays.backToJourneys}
        </Button>
      </div>

      <div className="divide-y rounded-xl border bg-card">
        {dayNumbers.map((n) => (
          <div key={n} className="flex items-center justify-between gap-3 p-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {interpolate(t.journeyDays.day, { day: n })}
              </p>
              <Badge variant={writtenDays.has(n) ? "default" : "secondary"}>
                {writtenDays.has(n) ? t.journeyDays.written : t.journeyDays.missing}
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
              {writtenDays.has(n) ? t.shared.edit : t.journeyDays.write}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

async function JourneyDayEditor({
  journey,
  dayNumber,
}: {
  journey: JourneyRow;
  dayNumber: number;
}) {
  const supabase = await createClient();
  const t = getDictionary(await getLocale()).admin;

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
          {interpolate(t.journeyDayEditor.heading, {
            title: journey.title,
            day: dayNumber,
          })}
        </p>
        <Button
          render={<Link href={backHref} />}
          nativeButton={false}
          size="sm"
          variant="ghost"
        >
          {t.journeyDayEditor.backToDays}
        </Button>
      </div>

      <form
        action={saveJourneyDay.bind(null, journey.id, dayNumber)}
        className="space-y-3 rounded-xl border bg-card p-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="title">{t.shared.title}</Label>
          <Input
            id="title"
            name="title"
            defaultValue={existing?.title}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scripture_reference">
            {t.journeyDayEditor.scriptureReference}
          </Label>
          <Input
            id="scripture_reference"
            name="scripture_reference"
            placeholder={t.journeyDayEditor.scripturePlaceholder}
            defaultValue={existing?.scripture_reference}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="message">{t.journeyDayEditor.message}</Label>
          <SuggestibleTextarea
            id="message"
            name="message"
            rows={4}
            defaultValue={existing?.message}
            required
            suggestions={t.journeyDayEditor.suggestions.message}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="explore">{t.journeyDayEditor.explore}</Label>
          <SuggestibleTextarea
            id="explore"
            name="explore"
            rows={3}
            defaultValue={existing?.explore}
            required
            suggestions={t.journeyDayEditor.suggestions.explore}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reflect">{t.journeyDayEditor.reflect}</Label>
          <SuggestibleTextarea
            id="reflect"
            name="reflect"
            rows={3}
            defaultValue={existing?.reflect}
            required
            suggestions={t.journeyDayEditor.suggestions.reflect}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pray">{t.journeyDayEditor.prayOptional}</Label>
          <SuggestibleTextarea
            id="pray"
            name="pray"
            rows={2}
            defaultValue={existing?.pray ?? ""}
            suggestions={t.journeyDayEditor.suggestions.pray}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="next_topic">{t.journeyDayEditor.nextTopic}</Label>
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
            {t.shared.cancel}
          </Button>
          <Button type="submit" size="sm">
            {t.journeyDayEditor.saveDay}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Boundaries computed in UTC — a summary report, not a timezone-precise
// ledger, so calendar-month/quarter/year in UTC is close enough and keeps
// the boundary math simple.
function getReportRange(
  period: ReportPeriod,
  locale: Locale,
  t: AdminMessages["reports"],
): {
  start: Date;
  end: Date;
  label: string;
} {
  const now = new Date();
  const end = now;
  const year = now.getUTCFullYear();

  if (period === "year") {
    return {
      start: new Date(Date.UTC(year, 0, 1)),
      end,
      label: `${year}`,
    };
  }

  if (period === "quarter") {
    const quarterStartMonth = Math.floor(now.getUTCMonth() / 3) * 3;
    const quarterNumber = quarterStartMonth / 3 + 1;
    return {
      start: new Date(Date.UTC(year, quarterStartMonth, 1)),
      end,
      label: interpolate(t.quarterLabel, { quarter: quarterNumber, year }),
    };
  }

  return {
    start: new Date(Date.UTC(year, now.getUTCMonth(), 1)),
    end,
    label: formatDate(locale, now, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
}

function ReportStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

async function ReportsAdmin({ period }: { period: ReportPeriod }) {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = getDictionary(locale).admin.reports;
  const { start, end, label } = getReportRange(period, locale, t);

  const range = { p_start: start.toISOString(), p_end: end.toISOString() };
  const [{ data, error }, { data: usageData, error: usageError }] =
    await Promise.all([
      supabase.rpc("admin_engagement_report", range),
      supabase.rpc("admin_usage_report", range),
    ]);

  if (error) {
    console.error("Failed to load engagement report", error);
  }
  if (usageError) {
    console.error("Failed to load usage report", usageError);
  }

  const report = (data as EngagementReportRow[] | null)?.[0] ?? null;
  const usage = (usageData as UsageReportRow[] | null)?.[0] ?? null;

  const periods: { value: ReportPeriod; label: string }[] = [
    { value: "month", label: t.periods.month },
    { value: "quarter", label: t.periods.quarter },
    { value: "year", label: t.periods.year },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {periods.map((p) => (
          <Link
            key={p.value}
            href={`/admin?tab=reports&period=${p.value}`}
            className={
              period === p.value
                ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                : "rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            }
          >
            {p.label}
          </Link>
        ))}
      </div>

      {!report ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <TrendingUp className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.loadFailed}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4" />
            <span>{interpolate(t.summaryFor, { label })}</span>
          </div>

          <div className="rounded-xl border bg-primary/10 p-4 text-center">
            <p className="text-3xl font-bold text-foreground">
              {report.gospel_prayers_count}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {t.decisionsForChrist}
            </p>
          </div>

          {usage && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {t.users}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <ReportStat value={usage.total_users} label={t.totalUsers} />
                <ReportStat
                  value={usage.users_in_period}
                  label={t.usedTheApp}
                />
                <ReportStat
                  value={usage.regular_users}
                  label={t.regularUsers}
                />
                <ReportStat
                  value={usage.devotion_readers}
                  label={t.readADevotion}
                />
                <ReportStat
                  value={usage.reminder_subscribers}
                  label={t.dailyRemindersOn}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {interpolate(t.usageNote, {
                  date: formatDate(locale, USAGE_TRACKING_SINCE, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }),
                })}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t.connect}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ReportStat value={report.new_signups} label={t.newSignups} />
              <ReportStat value={report.active_users} label={t.activeUsers} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t.commit}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ReportStat
                value={report.commitments_created}
                label={t.commitmentsMade}
              />
              <ReportStat
                value={report.commitments_completed}
                label={t.commitmentsKept}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t.evolve}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ReportStat
                value={report.sessions_completed}
                label={t.sessionsCompleted}
              />
              <ReportStat
                value={report.journeys_started}
                label={t.journeysStarted}
              />
              <ReportStat
                value={report.journeys_completed}
                label={t.journeysCompleted}
              />
              <ReportStat
                value={report.companion_messages_count}
                label={t.companionMessages}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t.engage}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ReportStat
                value={report.prayer_requests_count}
                label={t.prayerRequests}
              />
              <ReportStat value={report.posts_count} label={t.communityPosts} />
              <ReportStat value={report.comments_count} label={t.comments} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
