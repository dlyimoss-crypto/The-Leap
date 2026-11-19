"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/authorize";
import { CONTENT_TYPES, type ContentType } from "@/lib/localization/content";
import {
  isContentType,
  isTranslationLocale,
  loadEditor,
  type TranslationLocale,
} from "@/lib/localization/admin-data";
import type { TranslatableValue } from "@/lib/localization/translate";
import {
  isComplete,
  revalidateReaders,
  translateAndPublish,
} from "@/lib/localization/auto-translate";

// The translation workflow. Every action is admin-only (requireAdmin + RLS)
// and only ever writes the *_localizations tables — never the English
// source rows. Status changes are logged by a database trigger.

function editorPath(type: ContentType, id: string, locale: string) {
  return `/admin/translations/${type}/${id}?locale=${locale}`;
}

export type DraftActionResult = { ok: true } | { ok: false; error: string };

/**
 * Translates one item with AI and publishes it straight away (automatic
 * publishing). From the editor `force` re-translates even an up-to-date
 * item; the bulk button only does what's missing or out of date.
 */
export async function draftWithAI(
  type: string,
  id: string,
  locale: string,
  { force = true }: { force?: boolean } = {},
): Promise<DraftActionResult> {
  const { supabase } = await requireAdmin("/");
  if (!isContentType(type) || !isTranslationLocale(locale)) {
    return { ok: false, error: "Invalid request." };
  }
  const result = await translateAndPublish(supabase, type, id, locale, { force });
  return result.status === "failed" ? { ok: false, error: result.error } : { ok: true };
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
