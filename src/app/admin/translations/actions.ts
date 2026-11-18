"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/authorize";
import { CONTENT_TYPES, type ContentType } from "@/lib/localization/content";
import {
  isContentType,
  isTranslationLocale,
  loadEditor,
  loadGlossary,
  type TranslationLocale,
} from "@/lib/localization/admin-data";
import {
  draftTranslation,
  TranslationError,
  type TranslatableValue,
} from "@/lib/localization/translate";

// The translation workflow. Every action is admin-only (requireAdmin + RLS)
// and only ever writes the *_localizations tables — never the English
// source rows. Status changes are logged by a database trigger.

function editorPath(type: ContentType, id: string, locale: string) {
  return `/admin/translations/${type}/${id}?locale=${locale}`;
}

/** Readers' caches that hold translated content. */
function revalidateReaders(type: ContentType) {
  if (type === "journey") revalidateTag("journeys", { expire: 0 });
  if (type === "announcement") revalidateTag("announcement", { expire: 0 });
  revalidatePath("/", "layout");
}

function isFilled(value: TranslatableValue | undefined) {
  return Array.isArray(value) ? value.length > 0 : value != null && value.trim() !== "";
}

/** Same all-or-nothing rule readers get (overlay.ts): every part the English has. */
function isComplete(
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

export type DraftActionResult =
  | { ok: true; saved: true }
  | { ok: true; saved: false; fields: Record<string, TranslatableValue>; notes: string }
  | { ok: false; error: string };

/**
 * Drafts a translation with AI. If nothing is published yet, the draft is
 * saved straight into review (`awaiting_review`). If a translation is
 * already published, the draft is only returned to the editor form, so
 * readers keep the published text until an admin publishes the update.
 */
export async function draftWithAI(
  type: string,
  id: string,
  locale: string,
): Promise<DraftActionResult> {
  const { supabase } = await requireAdmin("/");
  if (!isContentType(type) || !isTranslationLocale(locale)) {
    return { ok: false, error: "Invalid request." };
  }

  const editor = await loadEditor(supabase, type, id, locale);
  if (!editor) return { ok: false, error: "This item no longer exists." };

  let result;
  try {
    result = await draftTranslation({
      type,
      locale,
      source: editor.sourceFields,
      glossary: await loadGlossary(supabase, locale),
    });
  } catch (error) {
    if (error instanceof TranslationError) return { ok: false, error: error.message };
    console.error("AI translation failed", error);
    return { ok: false, error: "The AI translation failed. Please try again." };
  }

  if (editor.translation?.status === "published") {
    return { ok: true, saved: false, fields: result.fields, notes: result.notes };
  }

  const { table, sourceColumn } = CONTENT_TYPES[type];
  const { error } = await supabase.from(table).upsert(
    {
      [sourceColumn]: id,
      locale,
      ...result.fields,
      translator_notes: result.notes || null,
      status: "awaiting_review",
      origin: "ai",
      source_version: editor.source.content_version,
      review_note: null,
    },
    { onConflict: `${sourceColumn},locale` },
  );
  if (error) {
    console.error("Failed to save AI draft", error);
    return { ok: false, error: "The draft couldn't be saved." };
  }

  revalidatePath("/admin/translations");
  return { ok: true, saved: true };
}

function readFields(
  formData: FormData,
  source: Record<string, TranslatableValue>,
): Record<string, TranslatableValue> {
  return Object.fromEntries(
    Object.entries(source).map(([field, english]) => {
      const raw = String(formData.get(field) ?? "");
      if (Array.isArray(english)) {
        return [field, raw.split("\n").map((l) => l.trim()).filter(Boolean)];
      }
      return [field, raw.trim() === "" ? null : raw.replace(/\r\n/g, "\n").trim()];
    }),
  );
}

/**
 * Save / publish / send back / unpublish, chosen by the submit button's
 * `intent`. Redirects back to the editor with the outcome.
 */
export async function reviewTranslation(formData: FormData) {
  const { supabase, user } = await requireAdmin("/");
  const type = formData.get("type");
  const id = String(formData.get("id") ?? "");
  const locale = formData.get("locale");
  const intent = String(formData.get("intent") ?? "");
  if (!isContentType(type) || !isTranslationLocale(locale) || !id) {
    redirect("/admin/translations");
  }

  const back = (result: string) => redirect(`${editorPath(type, id, locale)}&result=${result}`);

  const editor = await loadEditor(supabase, type, id, locale as TranslationLocale);
  if (!editor) redirect("/admin/translations");

  const { table, sourceColumn } = CONTENT_TYPES[type];
  const current = editor.translation;
  const fields = readFields(formData, editor.sourceFields);
  const edited = !current
    ? true
    : Object.entries(fields).some(
        ([f, v]) => JSON.stringify(v ?? null) !== JSON.stringify(current[f] ?? null),
      );

  let row: Record<string, unknown>;
  if (intent === "publish") {
    if (!isComplete(editor.sourceFields, fields)) back("incomplete");
    row = {
      ...fields,
      status: "published",
      // Reviewed against the current English, so it's up to date now.
      source_version: editor.source.content_version,
      origin: edited ? "human" : (current?.origin ?? "human"),
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_note: null,
    };
  } else if (intent === "save") {
    if (current?.status === "published") back("error");
    row = {
      ...fields,
      status: "awaiting_review",
      source_version: current?.source_version ?? editor.source.content_version,
      origin: edited ? "human" : (current?.origin ?? "human"),
      review_note: null,
    };
  } else if (intent === "send_back") {
    if (!current) back("error");
    const note = String(formData.get("review_note") ?? "").trim();
    row = {
      ...fields,
      status: "needs_revision",
      source_version: current!.source_version,
      review_note: note || null,
    };
  } else if (intent === "unpublish") {
    if (current?.status !== "published") back("error");
    row = { status: "awaiting_review", source_version: current!.source_version, review_note: null };
  } else {
    back("error");
  }

  const { error } = await supabase
    .from(table)
    .upsert({ [sourceColumn]: id, locale, ...row! }, { onConflict: `${sourceColumn},locale` });
  if (error) {
    console.error("Failed to update translation", error);
    back("error");
  }

  revalidatePath("/admin/translations");
  if (intent === "publish" || intent === "unpublish" || current?.status === "published") {
    revalidateReaders(type);
  }
  back(
    intent === "publish"
      ? "published"
      : intent === "unpublish"
        ? "unpublished"
        : intent === "send_back"
          ? "sent_back"
          : "saved",
  );
}

// ── Glossary ────────────────────────────────────────────────────────────

export async function saveGlossaryTerm(formData: FormData) {
  const { supabase, user } = await requireAdmin("/");
  const locale = formData.get("locale");
  if (!isTranslationLocale(locale)) redirect("/admin/translations/glossary");
  const id = String(formData.get("id") ?? "");
  const term = {
    locale,
    source_term: String(formData.get("source_term") ?? "").trim(),
    approved_term: String(formData.get("approved_term") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim() || null,
    kind: formData.get("kind") === "product" ? "product" : "theology",
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  };
  if (term.source_term && term.approved_term) {
    const { error } = id
      ? await supabase.from("glossary_terms").update(term).eq("id", id)
      : await supabase.from("glossary_terms").insert(term);
    if (error) console.error("Failed to save glossary term", error);
  }
  revalidatePath("/admin/translations/glossary");
}

export async function deleteGlossaryTerm(formData: FormData) {
  const { supabase } = await requireAdmin("/");
  const id = String(formData.get("id") ?? "");
  if (id) {
    const { error } = await supabase.from("glossary_terms").delete().eq("id", id);
    if (error) console.error("Failed to delete glossary term", error);
  }
  revalidatePath("/admin/translations/glossary");
}
