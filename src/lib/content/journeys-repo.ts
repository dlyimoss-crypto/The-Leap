import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { JourneyMeta, JourneySession } from "./journeys";

type JourneyRow = {
  slug: string;
  title: string;
  purpose: string;
  duration_days: number;
  completion_title: string;
  teaser: string | null;
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

function mapDbJourney(row: JourneyRow): JourneyMeta {
  return {
    slug: row.slug,
    domain: row.slug,
    title: row.title,
    purpose: row.purpose,
    durationDays: row.duration_days,
    completionTitle: row.completion_title,
    teaser: row.teaser,
  };
}

function mapDbDay(row: JourneyDayRow): JourneySession {
  return {
    day: row.day_number,
    title: row.title,
    scriptureReference: row.scripture_reference,
    message: row.message,
    explore: row.explore,
    reflect: row.reflect,
    pray: row.pray,
    nextTopic: row.next_topic,
  };
}

export async function findJourneyMeta(
  supabase: SupabaseClient,
  slug: string,
): Promise<JourneyMeta | null> {
  const { data } = await supabase
    .from("journeys")
    .select("slug, title, purpose, duration_days, completion_title, teaser")
    .eq("slug", slug)
    .maybeSingle<JourneyRow>();

  return data ? mapDbJourney(data) : null;
}

export async function findJourneySession(
  supabase: SupabaseClient,
  slug: string,
  day: number,
): Promise<JourneySession | null> {
  const { data: journey } = await supabase
    .from("journeys")
    .select("id")
    .eq("slug", slug)
    .maybeSingle<{ id: string }>();

  if (!journey) {
    return null;
  }

  const { data: dayRow } = await supabase
    .from("journey_days")
    .select(
      "day_number, title, scripture_reference, message, explore, reflect, pray, next_topic",
    )
    .eq("journey_id", journey.id)
    .eq("day_number", day)
    .maybeSingle<JourneyDayRow>();

  return dayRow ? mapDbDay(dayRow) : null;
}

// Every journey a user can start or continue right now: every published
// journey, oldest first (so "Faith in Christ", the onboarding journey, leads).
export async function findAvailableJourneys(
  supabase: SupabaseClient,
): Promise<JourneyMeta[]> {
  const { data, error } = await supabase
    .from("journeys")
    .select("slug, title, purpose, duration_days, completion_title, teaser")
    .eq("status", "published")
    .order("created_at", { ascending: true })
    .returns<JourneyRow[]>();

  if (error) {
    console.error("Failed to load published journeys", error);
  }

  return (data ?? []).map(mapDbJourney);
}

// "published journeys are publicly readable" (migration 0018) — same result
// for every user, so a plain anon client (rather than the caller's
// cookie-bound one) lets these be cached across requests/users instead of
// hitting Supabase on every Home render. Admin's journey create/update/
// publish/delete actions call revalidateTag("journeys") to invalidate
// immediately; the 60s revalidate is just a safety net.
function publicJourneysClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const findJourneyMetaCached = unstable_cache(
  async (slug: string) => findJourneyMeta(publicJourneysClient(), slug),
  ["journey-meta"],
  { tags: ["journeys"], revalidate: 60 },
);

export const findAvailableJourneysCached = unstable_cache(
  async () => findAvailableJourneys(publicJourneysClient()),
  ["available-journeys"],
  { tags: ["journeys"], revalidate: 60 },
);
