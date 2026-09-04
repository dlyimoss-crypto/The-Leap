import Link from "next/link";
import { Inbox } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/authorize";
import { banUser, resolveReport, unbanUser } from "./actions";

type Tab = "queue" | "users";

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
  const tab: Tab = tabParam === "users" ? "users" : "queue";

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
      </div>

      {tab === "queue" ? <ModerationQueue /> : <UsersList />}
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
