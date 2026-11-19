import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatDate, formatTime, interpolate } from "@/lib/i18n/format";
import { LOCALE_INFO } from "@/lib/i18n/locales";
import { CONTENT_TYPES } from "@/lib/localization/content";
import { isContentType, isTranslationLocale, loadEditor } from "@/lib/localization/admin-data";
import { isMultiline, stateBadgeVariant } from "../../editor-helpers";
import { TranslationEditor, type EditorField } from "./translation-editor";

// "Draft with AI" is a server action on this page; a long devotion can take
// a minute or more to translate.
export const maxDuration = 300;

const RESULTS = ["saved", "published", "unpublished", "sent_back", "incomplete", "error"] as const;

export default async function TranslationEditorPage(
  props: PageProps<"/admin/translations/[type]/[id]">,
) {
  const { supabase } = await requireAdmin();
  const { type, id } = await props.params;
  const searchParams = await props.searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const locale = first(searchParams.locale);
  if (!isContentType(type) || !isTranslationLocale(locale)) notFound();

  const uiLocale = await getLocale();
  const dict = getDictionary(uiLocale);
  const t = dict.admin.translations;

  const editor = await loadEditor(supabase, type, id, locale);
  if (!editor) notFound();

  const translation = editor.translation;
  const state = translation?.status ?? "missing";
  const outdated = !!translation && translation.source_version < editor.source.content_version;
  const resultParam = first(searchParams.result);
  const result = (RESULTS as readonly string[]).includes(resultParam ?? "") ? resultParam : null;
  const resultMessage =
    result === "saved" ? t.saved
    : result === "published" ? t.published
    : result === "unpublished" ? t.unpublished
    : result === "sent_back" ? t.sentBack
    : result === "incomplete" ? t.incomplete
    : result === "error" ? t.errorGeneric
    : null;

  const fields: EditorField[] = CONTENT_TYPES[type].fields.map((name) => {
    const english = editor.sourceFields[name];
    return {
      name,
      label: t.fields[name as keyof typeof t.fields],
      english,
      multiline: isMultiline(name),
      list: Array.isArray(english),
    };
  });
  const initial = Object.fromEntries(
    fields.map((f) => [f.name, (translation?.[f.name] as string | string[] | null) ?? null]),
  );

  return (
    <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-6 py-10">
      <BackLink href={`/admin/translations?locale=${locale}`} label={t.back} />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {t.types[type]} · <span lang={locale}>{LOCALE_INFO[locale].nativeName}</span>
        </p>
        <h1 lang="en" className="text-2xl font-heading font-semibold text-balance">
          {editor.label}
        </h1>
        {editor.context && <p className="text-sm text-muted-foreground">{editor.context}</p>}
        <div className="flex flex-wrap gap-2">
          <Badge variant={stateBadgeVariant(state)}>{t.state[state]}</Badge>
          {outdated && <Badge variant="destructive">{t.outdated}</Badge>}
        </div>
      </div>

      {resultMessage && (
        <p
          role={result === "error" || result === "incomplete" ? "alert" : "status"}
          className={
            result === "error" || result === "incomplete"
              ? "rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
              : "rounded-lg bg-muted p-3 text-sm"
          }
        >
          {resultMessage}
        </p>
      )}
      {outdated && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm">{t.sourceChanged}</p>
      )}
      {translation?.status === "needs_revision" && translation.review_note && (
        <div className="rounded-lg border p-3 text-sm">
          <p className="font-medium">{t.reviewNote}</p>
          <p className="whitespace-pre-line text-muted-foreground">{translation.review_note}</p>
        </div>
      )}
      {translation?.translator_notes && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <p className="font-medium">{t.translatorNotes}</p>
          <p className="whitespace-pre-line text-muted-foreground">{translation.translator_notes}</p>
        </div>
      )}

      <TranslationEditor
        // Remount with fresh values whenever the saved translation changes.
        key={String(translation?.updated_at ?? "new")}
        type={type}
        id={id}
        locale={locale}
        fields={fields}
        initial={initial}
        hasRow={!!translation}
        published={translation?.status === "published"}
        labels={{
          draftWithAI: t.draftWithAI,
          redraftWithAI: t.redraftWithAI,
          drafting: t.drafting,
          saveDraft: t.saveDraft,
          publish: t.publish,
          publishUpdate: t.publishUpdate,
          sendBack: t.sendBack,
          sendBackNote: t.sendBackNote,
          unpublish: t.unpublish,
          english: t.english,
          translationIn: interpolate(t.translationIn, { language: LOCALE_INFO[locale].nativeName }),
          translatorNotes: t.translatorNotes,
          onePerLine: t.onePerLine,
          emptyField: t.empty_field,
        }}
      />

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.history}</h2>
        {editor.events.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.noHistory}</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {editor.events.map((event) => (
              <li key={event.id} className="flex flex-wrap gap-x-2 text-muted-foreground">
                <span className="font-mono text-xs">
                  {formatDate(uiLocale, event.created_at, { day: "numeric", month: "short" })}{" "}
                  {formatTime(uiLocale, event.created_at)}
                </span>
                <span className="text-foreground">
                  {event.from_status ? `${t.state[event.from_status]} → ` : ""}
                  {t.state[event.to_status]}
                </span>
                {event.actor?.display_name && <span>· {event.actor.display_name}</span>}
                {event.note && <span className="w-full ps-4 italic">“{event.note}”</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
