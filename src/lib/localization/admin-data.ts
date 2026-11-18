import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n/locales";
import { CONTENT_TYPES, type ContentType } from "./content";
import type { GlossaryEntry, TranslatableValue } from "./translate";

// Admin-side reads for the translation workflow (all under admin RLS).

export const TRANSLATION_LOCALES = ["sw", "de", "fr", "es", "zh-CN"] as const satisfies readonly Locale[];
export type TranslationLocale = (typeof TRANSLATION_LOCALES)[number];

export function isTranslationLocale(value: unknown): value is TranslationLocale {
  return typeof value === "string" && (TRANSLATION_LOCALES as readonly string[]).includes(value);
}

export function isContentType(value: unknown): value is ContentType {
  return typeof value === "string" && value in CONTENT_TYPES;
}

export type LocalizationStatus =
  | "pending"
  | "translating"
  | "awaiting_review"
  | "needs_revision"
  | "approved"
  | "published";

/** Where an item stands in one language. "missing" = no row yet. */
export type ItemState = LocalizationStatus | "missing";

const SOURCE: Record<
  ContentType,
  { table: string; select: string; order: { column: string; ascending: boolean } }
> = {
  journey: {
    table: "journeys",
    select: "id, content_version, title, purpose, teaser, completion_title, status",
    order: { column: "created_at", ascending: true },
  },
  journey_day: {
    table: "journey_days",
    select:
      "id, content_version, day_number, title, message, explore, reflect, pray, next_topic, journey:journeys(title, slug)",
    order: { column: "day_number", ascending: true },
  },
  devotion: {
    table: "devotions",
    select: "id, content_version, title, body, reflection, prayer, practice, publish_date",
    order: { column: "publish_date", ascending: false },
  },
  announcement: {
    table: "prayer_movements",
    select: "id, content_version, title, body, link_label, prayer_points, status, kind",
    order: { column: "created_at", ascending: false },
  },
};

type SourceRow = Record<string, unknown> & { id: string; content_version: number; title: string };

export type OverviewItem = {
  type: ContentType;
  id: string;
  label: string;
  context: string | null;
  state: ItemState;
  outdated: boolean;
};

function labelFor(type: ContentType, row: SourceRow): { label: string; context: string | null } {
  if (type === "journey_day") {
    const journey = row.journey as { title: string } | null;
    return { label: row.title, context: `${journey?.title ?? ""} · ${row.day_number}` };
  }
  if (type === "devotion") return { label: row.title, context: (row.publish_date as string | null) ?? null };
  return { label: row.title, context: null };
}

async function loadSources(supabase: SupabaseClient, type: ContentType): Promise<SourceRow[]> {
  const { table, select, order } = SOURCE[type];
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .order(order.column, { ascending: order.ascending, nullsFirst: false });
  if (error) {
    console.error(`Failed to load ${type} sources`, error);
    return [];
  }
  return (data ?? []) as unknown as SourceRow[];
}

/** Every translatable item with its state in `locale`. */
export async function loadOverview(
  supabase: SupabaseClient,
  locale: TranslationLocale,
): Promise<{ items: OverviewItem[]; migrationMissing: boolean }> {
  const types = Object.keys(CONTENT_TYPES) as ContentType[];
  let migrationMissing = false;

  const perType = await Promise.all(
    types.map(async (type) => {
      const { table, sourceColumn } = CONTENT_TYPES[type];
      const [sources, translations] = await Promise.all([
        loadSources(supabase, type),
        supabase.from(table).select(`${sourceColumn}, status, source_version`).eq("locale", locale),
      ]);
      if (translations.error) {
        migrationMissing = true;
        console.error(`Failed to load ${type} translations`, translations.error);
      }
      const byId = new Map(
        ((translations.data ?? []) as unknown as Record<string, unknown>[]).map((t) => [
          t[sourceColumn] as string,
          t as { status: LocalizationStatus; source_version: number },
        ]),
      );
      return sources.map((row): OverviewItem => {
        const t = byId.get(row.id);
        return {
          type,
          id: row.id,
          ...labelFor(type, row),
          state: t?.status ?? "missing",
          outdated: !!t && t.source_version < row.content_version,
        };
      });
    }),
  );
  return { items: perType.flat(), migrationMissing };
}

export type EditorData = {
  source: SourceRow;
  sourceFields: Record<string, TranslatableValue>;
  translation:
    | (Record<string, unknown> & {
        id: string;
        status: LocalizationStatus;
        source_version: number;
        origin: "ai" | "human";
        review_note: string | null;
        translator_notes: string | null;
        reviewed_at: string | null;
      })
    | null;
  events: {
    id: number;
    from_status: LocalizationStatus | null;
    to_status: LocalizationStatus;
    note: string | null;
    created_at: string;
    actor: { display_name: string | null } | null;
  }[];
  label: string;
  context: string | null;
};

export async function loadEditor(
  supabase: SupabaseClient,
  type: ContentType,
  id: string,
  locale: TranslationLocale,
): Promise<EditorData | null> {
  const { table: sourceTable, select } = SOURCE[type];
  const { table, sourceColumn, fields } = CONTENT_TYPES[type];

  const [{ data: source }, { data: translation }, { data: events }] = await Promise.all([
    supabase.from(sourceTable).select(select).eq("id", id).maybeSingle(),
    supabase.from(table).select("*").eq(sourceColumn, id).eq("locale", locale).maybeSingle(),
    supabase
      .from("localization_events")
      .select("id, from_status, to_status, note, created_at, actor:profiles(display_name)")
      .eq("content_type", type)
      .eq("source_id", id)
      .eq("locale", locale)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  if (!source) return null;

  const row = source as unknown as SourceRow;
  const sourceFields = Object.fromEntries(
    fields.map((f) => [f, (row[f] ?? null) as TranslatableValue]),
  );
  return {
    source: row,
    sourceFields,
    translation: (translation as EditorData["translation"]) ?? null,
    events: (events ?? []) as unknown as EditorData["events"],
    ...labelFor(type, row),
  };
}

export async function loadGlossary(
  supabase: SupabaseClient,
  locale: TranslationLocale,
): Promise<(GlossaryEntry & { id: string; kind: string })[]> {
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("id, source_term, approved_term, notes, kind")
    .eq("locale", locale)
    .order("kind", { ascending: false })
    .order("source_term");
  if (error) {
    console.error("Failed to load glossary", error);
    return [];
  }
  return data ?? [];
}
