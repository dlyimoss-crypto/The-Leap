import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { JourneyMeta, JourneySession } from "./journeys";
import type { Locale } from "@/lib/i18n/locales";
import { localizeRow, localizeRows } from "@/lib/localization/content";
import type { Served } from "@/lib/localization/overlay";

type JourneyRow = {
  id: string;
  slug: string;
  title: string;
  purpose: string;
  duration_days: number;
  completion_title: string;
  teaser: string | null;
};

type JourneyDayRow = {
  id: string;
  day_number: number;
  title: string;
  scripture_reference: string;
  message: string;
  explore: string;
  reflect: string;
  pray: string | null;
  next_topic: string | null;
};

function mapDbJourney(row: JourneyRow & Served): JourneyMeta {
  return {
    slug: row.slug,
    domain: row.slug,
    title: row.title,
    purpose: row.purpose,
    durationDays: row.duration_days,
    completionTitle: row.completion_title,
    teaser: row.teaser,
    servedLocale: row.servedLocale,
  };
}

function mapDbDay(row: JourneyDayRow & Served): JourneySession {
  return {
    day: row.day_number,
    title: row.title,
    scriptureReference: row.scripture_reference,
    message: row.message,
    explore: row.explore,
    reflect: row.reflect,
    pray: row.pray,
    nextTopic: row.next_topic,
    servedLocale: row.servedLocale,
  };
}

export async function findJourneyMeta(
  supabase: SupabaseClient,
  slug: string,
  locale: Locale = "en",
): Promise<JourneyMeta | null> {
  const { data } = await supabase
    .from("journeys")
    .select("id, slug, title, purpose, duration_days, completion_title, teaser")
    .eq("slug", slug)
    .maybeSingle<JourneyRow>();

  const localized = await localizeRow(supabase, "journey", data, locale);
  return localized ? mapDbJourney(localized) : null;
}

export async function findJourneySession(
  supabase: SupabaseClient,
  slug: string,
  day: number,
  locale: Locale = "en",
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
      "id, day_number, title, scripture_reference, message, explore, reflect, pray, next_topic",
    )
    .eq("journey_id", journey.id)
    .eq("day_number", day)
    .maybeSingle<JourneyDayRow>();

  const localized = await localizeRow(supabase, "journey_day", dayRow, locale);
  return localized ? mapDbDay(localized) : null;
}

// Every journey a user can start or continue right now: every published
// journey, oldest first (so "Faith in Christ", the onboarding journey, leads).
export async function findAvailableJourneys(
  supabase: SupabaseClient,
  locale: Locale = "en",
): Promise<JourneyMeta[]> {
  const { data, error } = await supabase
    .from("journeys")
    .select("id, slug, title, purpose, duration_days, completion_title, teaser")
    .eq("status", "published")
    .order("created_at", { ascending: true })
    .returns<JourneyRow[]>();

  if (error) {
    console.error("Failed to load published journeys", error);
  }

  return (await localizeRows(supabase, "journey", data ?? [], locale)).map(mapDbJourney);
}

// "published journeys are publicly readable" (migration 0018) — same result
// for every user, so a plain anon client (rather than the caller's
// cookie-bound one) lets these be cached across requests/users instead of
// hitting Supabase on every Home render. Admin's journey create/update/
// publish/delete actions (and translation publishing) call
// revalidateTag("journeys") to invalidate. The locale argument is part of
// the cache key, so each language is cached separately
// immediately; the 60s revalidate is just a safety net.
function publicJourneysClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const findJourneyMetaCached = unstable_cache(
  async (slug: string, locale: Locale = "en") =>
    findJourneyMeta(publicJourneysClient(), slug, locale),
  ["journey-meta"],
  { tags: ["journeys"], revalidate: 60 },
);

export const findAvailableJourneysCached = unstable_cache(
  async (locale: Locale = "en") => findAvailableJourneys(publicJourneysClient(), locale),
  ["available-journeys"],
  { tags: ["journeys"], revalidate: 60 },
);
