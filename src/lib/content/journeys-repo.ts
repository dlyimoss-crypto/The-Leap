import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getJourneyMeta,
  getJourneySession,
  type JourneyMeta,
  type JourneySession,
} from "./journeys";

// The one journey shipped as content-as-code (ticket 02). Everything else an
// admin authors lives in the `journeys`/`journey_days` tables instead, since
// Vercel's runtime filesystem is read-only and can't accept new content files.
const FILE_JOURNEY_SLUG = "faith-in-christ";

type JourneyRow = {
  slug: string;
  title: string;
  purpose: string;
  duration_days: number;
  completion_title: string;
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
  const fileMeta = getJourneyMeta(slug);
  if (fileMeta) {
    return fileMeta;
  }

  const { data } = await supabase
    .from("journeys")
    .select("slug, title, purpose, duration_days, completion_title")
    .eq("slug", slug)
    .maybeSingle<JourneyRow>();

  return data ? mapDbJourney(data) : null;
}

export async function findJourneySession(
  supabase: SupabaseClient,
  slug: string,
  day: number,
): Promise<JourneySession | null> {
  const fileSession = getJourneySession(slug, day);
  if (fileSession) {
    return fileSession;
  }

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

// Every journey a user can start or continue right now: the one file-based
// journey (always available) plus every published, admin-authored journey.
export async function findAvailableJourneys(
  supabase: SupabaseClient,
): Promise<JourneyMeta[]> {
  const fileJourney = getJourneyMeta(FILE_JOURNEY_SLUG);

  const { data, error } = await supabase
    .from("journeys")
    .select("slug, title, purpose, duration_days, completion_title")
    .eq("status", "published")
    .returns<JourneyRow[]>();

  if (error) {
    console.error("Failed to load published journeys", error);
  }

  return [
    ...(fileJourney ? [fileJourney] : []),
    ...(data ?? []).map(mapDbJourney),
  ];
}
