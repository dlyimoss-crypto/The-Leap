import { HeartHandshake } from "lucide-react";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getActiveAnnouncementCached,
  getPrayerMovementParticipation,
} from "@/lib/supabase/announcements";
import { PrayerComposer } from "./prayer-composer";
import { PrayerMovementCard } from "./prayer-movement-card";
import {
  PrayerRequestCard,
  type PrayerRequestRow,
} from "./prayer-request-card";

type Tab = "requests" | "testimonies" | "mine";

const TABS: Tab[] = ["requests", "testimonies", "mine"];

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

  const { supabase, user } = await requireUser();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.community;

  // Only a prayer announcement belongs in the Prayer Room — news, events
  // and adverts show on Home alone.
  const activeAnnouncement = await getActiveAnnouncementCached();
  const activeMovement =
    activeAnnouncement?.kind === "prayer" ? activeAnnouncement : null;
  const movementParticipation = activeMovement
    ? await getPrayerMovementParticipation(supabase, activeMovement.id, user.id)
    : null;

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
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/connect" label={dict.nav.connect} />
      <h1 className="text-2xl font-heading font-semibold">
        {t.prayerRoom.heading}
      </h1>

      {activeMovement && movementParticipation && (
        <PrayerMovementCard
          movement={activeMovement}
          participantCount={movementParticipation.count}
          hasPrayed={movementParticipation.hasPrayed}
          locale={locale}
          dict={t.prayerMovement}
        />
      )}

      <div className="flex gap-4 border-b">
        {TABS.map((key) => (
          <Link
            key={key}
            href={key === "requests" ? "/prayer-room" : `/prayer-room?tab=${key}`}
            className={
              key === tab
                ? "border-b-2 border-primary pb-2 text-sm font-semibold text-primary"
                : "pb-2 text-sm font-medium text-muted-foreground"
            }
          >
            {t.prayerRoom.tabs[key]}
          </Link>
        ))}
      </div>

      {tab === "requests" && <PrayerComposer dict={t.prayerComposer} />}

      {showCrisisBanner && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
          {t.crisisBanner.intro}{" "}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-destructive underline"
          >
            {t.crisisBanner.findSupportLink}
          </a>{" "}
          {t.crisisBanner.outro}
        </div>
      )}

      <div className="space-y-3">
        {requests.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <HeartHandshake className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {tab === "requests" && t.prayerRoom.emptyRequests}
              {tab === "testimonies" && t.prayerRoom.emptyTestimonies}
              {tab === "mine" && t.prayerRoom.emptyMine}
            </p>
          </div>
        )}
        {requests.map((request) => (
          <PrayerRequestCard
            key={request.id}
            request={request}
            currentUserId={user.id}
            showManageActions={tab === "mine"}
            dict={t}
          />
        ))}
      </div>
    </main>
  );
}
