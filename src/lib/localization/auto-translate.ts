import "server-only";
import { after } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CONTENT_TYPES, type ContentType } from "./content";
import {
  TRANSLATION_LOCALES,
  loadEditor,
  loadGlossary,
  type TranslationLocale,
} from "./admin-data";
import { draftTranslation, TranslationError, type TranslatableValue } from "./translate";

// Automatic publishing (decision K3, revised 2026-11-19): AI translations of
// journeys, journey days, devotions and announcements go live straight
// away. Admins can still correct a translation in Admin → Translations.
//
// A language whose published translation already matches the current
// English is skipped, so saving content without changing its text costs
// nothing. When the English changes, the translation is made afresh — this
// replaces any hand corrections in that language.

export type AutoTranslateResult =
  | { status: "published" | "up_to_date" }
  /** The AI left out a part the English has; saved for an admin to finish. */
  | { status: "needs_review" }
  | { status: "failed"; error: string };

/** Readers' caches that hold translated content. */
export function revalidateReaders(type: ContentType) {
  try {
    if (type === "journey") revalidateTag("journeys", { expire: 0 });
    if (type === "announcement") revalidateTag("announcement", { expire: 0 });
    revalidatePath("/", "layout");
    revalidatePath("/admin/translations");
  } catch (error) {
    console.error("Failed to refresh caches after translation", error);
  }
}

function isFilled(value: TranslatableValue | undefined) {
  return Array.isArray(value) ? value.length > 0 : value != null && value.trim() !== "";
}

/** Same all-or-nothing rule readers get (overlay.ts): every part the English has. */
export function isComplete(
  source: Record<string, TranslatableValue>,
  fields: Record<string, TranslatableValue>,
) {
  return Object.entries(source).every(([field, english]) => {
    if (!isFilled(english)) return true;
    const value = fields[field];
    if (!isFilled(value)) return false;
    return !Array.isArray(english) || (Array.isArray(value) && value.length >= english.length);
  });
}

/**
 * Translates one item into one language with AI and publishes it. Skips it
 * if the published translation is already up to date, unless `force`.
 */
export async function translateAndPublish(
  supabase: SupabaseClient,
  type: ContentType,
  id: string,
  locale: TranslationLocale,
  { force = false }: { force?: boolean } = {},
): Promise<AutoTranslateResult> {
  const editor = await loadEditor(supabase, type, id, locale);
  if (!editor) return { status: "failed", error: "This item no longer exists." };

  const current = editor.translation;
  const upToDate =
    current?.status === "published" && current.source_version >= editor.source.content_version;
  if (upToDate && !force) return { status: "up_to_date" };

  let result;
  try {
    result = await draftTranslation({
      type,
      locale,
      source: editor.sourceFields,
      glossary: await loadGlossary(supabase, locale),
    });
  } catch (error) {
    if (error instanceof TranslationError) return { status: "failed", error: error.message };
    console.error("AI translation failed", error);
    return { status: "failed", error: "The AI translation failed. Please try again." };
  }

  const complete = isComplete(editor.sourceFields, result.fields);
  const { table, sourceColumn } = CONTENT_TYPES[type];
  const { error } = await supabase.from(table).upsert(
    {
      [sourceColumn]: id,
      locale,
      ...result.fields,
      translator_notes: result.notes || null,
      status: complete ? "published" : "awaiting_review",
      origin: "ai",
      source_version: editor.source.content_version,
      reviewed_by: null,
      reviewed_at: null,
      review_note: null,
    },
    { onConflict: `${sourceColumn},locale` },
  );
  if (error) {
    console.error("Failed to save AI translation", error);
    return { status: "failed", error: "The translation couldn't be saved." };
  }

  revalidateReaders(type);
  return { status: complete ? "published" : "needs_review" };
}

/** Every language at once (each is one AI call; they run in parallel). */
export async function translateIntoAllLanguages(
  supabase: SupabaseClient,
  type: ContentType,
  id: string,
) {
  const results = await Promise.all(
    TRANSLATION_LOCALES.map(async (locale) => [locale, await translateAndPublish(supabase, type, id, locale)] as const),
  );
  for (const [locale, result] of results) {
    if (result.status === "failed" || result.status === "needs_review") {
      console.error(`Automatic translation of ${type} ${id} into ${locale}: ${result.status}`, result);
    }
  }
  return results;
}

/**
 * Call from an admin save action: translates the item into every language
 * after the response is sent, so saving never waits for the AI. Failures
 * are logged and show in Admin → Translations, where "Translate everything
 * missing" retries them.
 */
export function translateInBackground(supabase: SupabaseClient, type: ContentType, id: string | null | undefined) {
  if (!id) return;
  after(() => translateIntoAllLanguages(supabase, type, id));
}
