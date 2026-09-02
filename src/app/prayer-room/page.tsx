import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrayerComposer } from "./prayer-composer";
import {
  PrayerRequestCard,
  type PrayerRequestRow,
} from "./prayer-request-card";

type Tab = "requests" | "testimonies" | "mine";

const TABS: { key: Tab; label: string }[] = [
  { key: "requests", label: "Requests" },
  { key: "testimonies", label: "Testimonies" },
  { key: "mine", label: "Mine" },
];

type RawRow = {
  id: string;
  user_id: string;
  body: string;
  visibility: "public" | "private";
  is_anonymous: boolean;
  status: "open" | "answered" | "hidden" | "removed";
  testimony: string | null;
  created_at: string;
  profiles: { display_name: string | null } | null;
  prayer_responses: { count: number }[] | null;
};

export default async function PrayerRoomPage(
  props: PageProps<"/prayer-room">,
) {
  const searchParams = await props.searchParams;
  const tabParam = Array.isArray(searchParams.tab)
    ? searchParams.tab[0]
    : searchParams.tab;
  const tab: Tab =
    tabParam === "testimonies" || tabParam === "mine" ? tabParam : "requests";
  const showCrisisBanner = searchParams.crisis === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const selectColumns =
    "id, user_id, body, visibility, is_anonymous, status, testimony, created_at, profiles(display_name), prayer_responses(count)";

  let query = supabase.from("prayer_requests").select(selectColumns);

  if (tab === "requests") {
    query = query
      .in("status", ["open", "answered"])
      .or(`visibility.eq.public,user_id.eq.${user.id}`);
  } else if (tab === "testimonies") {
    query = query
      .eq("status", "answered")
      .or(`visibility.eq.public,user_id.eq.${user.id}`);
  } else {
    query = query.eq("user_id", user.id);
  }

  const { data: rows, error } = await query
    .order("created_at", { ascending: false })
    .returns<RawRow[]>();

  if (error) {
    console.error("Failed to load prayer requests", error);
  }

  const rowIds = (rows ?? []).map((row) => row.id);
  const { data: myResponses } =
    rowIds.length > 0
      ? await supabase
          .from("prayer_responses")
          .select("prayer_request_id")
          .eq("user_id", user.id)
          .in("prayer_request_id", rowIds)
      : { data: [] };

  const prayedIds = new Set(
    (myResponses ?? []).map((r) => r.prayer_request_id as string),
  );

  const requests: PrayerRequestRow[] = (rows ?? []).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    body: row.body,
    visibility: row.visibility,
    is_anonymous: row.is_anonymous,
    status: row.status,
    testimony: row.testimony,
    created_at: row.created_at,
    displayName: row.profiles?.display_name ?? null,
    prayedCount: row.prayer_responses?.[0]?.count ?? 0,
    hasPrayed: prayedIds.has(row.id),
  }));

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold">Prayer Room</h1>
        <Link href="/" className="text-sm text-muted-foreground">
          Home
        </Link>
      </div>

      <div className="flex gap-4 border-b">
        {TABS.map(({ key, label }) => (
          <Link
            key={key}
            href={key === "requests" ? "/prayer-room" : `/prayer-room?tab=${key}`}
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

      {tab === "requests" && <PrayerComposer />}

      {showCrisisBanner && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
          You don&apos;t have to go through this alone. If you&apos;re in
          immediate danger or thinking about harming yourself, please seek
          immediate help.{" "}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-destructive underline"
          >
            Find crisis support in your country →
          </a>{" "}
          You can also contact a trusted person, local church, professional
          counselor, or emergency service.
        </div>
      )}

      <div className="space-y-3">
        {requests.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {tab === "requests" && "No prayer requests yet — be the first."}
            {tab === "testimonies" && "No testimonies yet."}
            {tab === "mine" && "You haven't posted a prayer request yet."}
          </p>
        )}
        {requests.map((request) => (
          <PrayerRequestCard
            key={request.id}
            request={request}
            currentUserId={user.id}
            showManageActions={tab === "mine"}
          />
        ))}
      </div>
    </main>
  );
}
