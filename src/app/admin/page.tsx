import Link from "next/link";
import { Inbox, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/authorize";
import { getDevotionStatus } from "@/lib/devotion";
import {
  banUser,
  createDevotion,
  deleteDevotion,
  resolveReport,
  unbanUser,
  updateDevotion,
} from "./actions";

type Tab = "queue" | "users" | "devotions";

type DevotionRow = {
  id: string;
  title: string;
  scripture_reference: string | null;
  body: string;
  reflection: string | null;
  prayer: string | null;
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
};

export default async function AdminPage(props: PageProps<"/admin">) {
  const searchParams = await props.searchParams;
  const tabParam = Array.isArray(searchParams.tab)
    ? searchParams.tab[0]
    : searchParams.tab;
  const tab: Tab =
    tabParam === "users" ? "users" : tabParam === "devotions" ? "devotions" : "queue";
  const editIdParam = Array.isArray(searchParams.edit)
    ? searchParams.edit[0]
    : searchParams.edit;

  await requireAdmin();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-heading font-semibold">Admin</h1>

      <div className="flex gap-4 border-b">
        <Link
          href="/admin"
          className={
            tab === "queue"
              ? "border-b-2 border-primary pb-2 text-sm font-semibold text-primary"
              : "pb-2 text-sm font-medium text-muted-foreground"
          }
        >
          Moderation queue
        </Link>
        <Link
          href="/admin?tab=users"
          className={
            tab === "users"
              ? "border-b-2 border-primary pb-2 text-sm font-semibold text-primary"
              : "pb-2 text-sm font-medium text-muted-foreground"
          }
        >
          Users
        </Link>
        <Link
          href="/admin?tab=devotions"
          className={
            tab === "devotions"
              ? "border-b-2 border-primary pb-2 text-sm font-semibold text-primary"
              : "pb-2 text-sm font-medium text-muted-foreground"
          }
        >
          Devotions
        </Link>
      </div>

      {tab === "queue" ? (
        <ModerationQueue />
      ) : tab === "users" ? (
        <UsersList />
      ) : (
        <DevotionsAdmin editId={editIdParam} />
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

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_banned")
    .order("display_name", { ascending: true })
    .returns<ProfileRow[]>();

  if (error) {
    console.error("Failed to load users", error);
  }

  return (
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
          {(profiles ?? []).map((p) => (
            <tr key={p.id} className="border-b last:border-0">
              <td className="p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={p.display_name} className="size-7 text-[10px]" />
                  {p.display_name ?? "(no name)"}
                </div>
              </td>
              <td className="p-3">
                <Badge variant={p.is_banned ? "destructive" : "secondary"}>
                  {p.is_banned ? "Banned" : "Active"}
                </Badge>
              </td>
              <td className="p-3 text-right">
                <form action={(p.is_banned ? unbanUser : banUser).bind(null, p.id)}>
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
  );
}

async function DevotionsAdmin({ editId }: { editId: string | undefined }) {
  const supabase = await createClient();

  const { data: devotions, error } = await supabase
    .from("devotions")
    .select(
      "id, title, scripture_reference, body, reflection, prayer, publish_date",
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
