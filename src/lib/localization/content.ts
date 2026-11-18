import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n/locales";
import { overlayTranslation, type Served } from "./overlay";

// Reading translated content (migration 0039). Readers only ever get
// `published` translations (also enforced by RLS); everything else falls
// back to the English source, marked servedLocale "en".

export const CONTENT_TYPES = {
  journey: {
    table: "journey_localizations",
    sourceColumn: "journey_id",
    fields: ["title", "purpose", "teaser", "completion_title"],
  },
  journey_day: {
    table: "journey_day_localizations",
    sourceColumn: "journey_day_id",
    fields: ["title", "message", "explore", "reflect", "pray", "next_topic"],
  },
  devotion: {
    table: "devotion_localizations",
    sourceColumn: "devotion_id",
    fields: ["title", "body", "reflection", "prayer", "practice"],
  },
  announcement: {
    table: "announcement_localizations",
    sourceColumn: "announcement_id",
    fields: ["title", "body", "link_label", "prayer_points"],
  },
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;
type Fields<C extends ContentType> = (typeof CONTENT_TYPES)[C]["fields"][number];

/**
 * Published translations into `locale` for the given source ids, keyed by
 * source id. One query for any number of ids. Errors (including the
 * table not existing yet, before migration 0039) are logged and treated
 * as "no translation", so the page falls back to English rather than
 * breaking.
 */
async function fetchPublished<C extends ContentType>(
  supabase: SupabaseClient,
  type: C,
  ids: string[],
  locale: Locale,
): Promise<Map<string, Partial<Record<Fields<C>, string | string[] | null>>>> {
  const map = new Map();
  if (locale === "en" || ids.length === 0) return map;

  const { table, sourceColumn, fields } = CONTENT_TYPES[type];
  const { data, error } = await supabase
    .from(table)
    .select([sourceColumn, ...fields].join(", "))
    .in(sourceColumn, ids)
    .eq("locale", locale)
    .eq("status", "published");

  if (error) {
    console.error(`Failed to load ${type} translations`, error);
    return map;
  }
  for (const row of (data ?? []) as unknown as Record<string, unknown>[]) {
    map.set(row[sourceColumn] as string, row);
  }
  return map;
}

/** Localizes a list of source rows (each with an `id`) in one query. */
export async function localizeRows<C extends ContentType, T extends { id: string }>(
  supabase: SupabaseClient,
  type: C,
  rows: T[],
  locale: Locale,
): Promise<(T & Served)[]> {
  const translations = await fetchPublished(supabase, type, rows.map((r) => r.id), locale);
  const fields = CONTENT_TYPES[type].fields as unknown as readonly (keyof T & string)[];
  return rows.map((row) =>
    overlayTranslation(row, translations.get(row.id) as Partial<Record<keyof T & string, string | string[] | null>>, fields, locale),
  );
}

/** Localizes one source row (or passes null through). */
export async function localizeRow<C extends ContentType, T extends { id: string }>(
  supabase: SupabaseClient,
  type: C,
  row: T | null,
  locale: Locale,
): Promise<(T & Served) | null> {
  if (!row) return null;
  const [result] = await localizeRows(supabase, type, [row], locale);
  return result;
}
