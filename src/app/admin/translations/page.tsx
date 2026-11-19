import Link from "next/link";
import { BookText, ChevronRight } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { interpolate } from "@/lib/i18n/format";
import { LOCALE_INFO } from "@/lib/i18n/locales";
import { CONTENT_TYPES, type ContentType } from "@/lib/localization/content";
import {
  isTranslationLocale,
  loadOverview,
  TRANSLATION_LOCALES,
  type OverviewItem,
} from "@/lib/localization/admin-data";
import { BulkDraft } from "./bulk-draft";
import { stateBadgeVariant } from "./editor-helpers";

// Bulk AI drafting runs one item per server-action call from this page.
export const maxDuration = 300;

const FILTERS = ["todo", "all", "published"] as const;
type Filter = (typeof FILTERS)[number];

function needsAttention(item: OverviewItem) {
  return item.state !== "published" || item.outdated;
}

export default async function TranslationsPage(props: PageProps<"/admin/translations">) {
  const { supabase } = await requireAdmin();
  const searchParams = await props.searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const locale = isTranslationLocale(first(searchParams.locale)) ? (first(searchParams.locale) as (typeof TRANSLATION_LOCALES)[number]) : TRANSLATION_LOCALES[0];
  const filterParam = first(searchParams.filter);
  const filter: Filter = (FILTERS as readonly string[]).includes(filterParam ?? "") ? (filterParam as Filter) : "todo";

  const dict = getDictionary(await getLocale());
  const t = dict.admin.translations;

  const { items, migrationMissing } = await loadOverview(supabase, locale);
  const published = items.filter((i) => i.state === "published").length;
  const shown = items.filter((i) =>
    filter === "all" ? true : filter === "published" ? i.state === "published" : needsAttention(i),
  );
  const notStarted = items.filter((i) => i.state === "missing").map((i) => ({ type: i.type, id: i.id }));
  const href = (params: { locale?: string; filter?: string }) =>
    `/admin/translations?locale=${params.locale ?? locale}&filter=${params.filter ?? filter}`;

  return (
    <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-6 py-10">
      <BackLink href="/admin" label={dict.admin.shared.backToAdmin} />
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-semibold">{t.heading}</h1>
          <p className="text-sm text-muted-foreground">{t.intro}</p>
        </div>
        <Link
          href={`/admin/translations/glossary?locale=${locale}`}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          <BookText className="size-4" />
          {t.glossaryLink}
        </Link>
      </div>

      {migrationMissing && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.migrationMissing}
        </p>
      )}

      <nav className="flex flex-wrap gap-2" aria-label={dict.language.pickerLabel}>
        {TRANSLATION_LOCALES.map((code) => (
          <Link
            key={code}
            href={href({ locale: code })}
            lang={code}
            aria-current={code === locale ? "page" : undefined}
            className={
              code === locale
                ? "rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground"
                : "rounded-full border px-3 py-1 text-sm hover:bg-muted"
            }
          >
            {LOCALE_INFO[code].nativeName}
          </Link>
        ))}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {interpolate(t.summary, { published, total: items.length })}
        </p>
        <div className="flex flex-wrap gap-1 text-sm">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={href({ filter: f })}
              aria-current={f === filter ? "page" : undefined}
              className={f === filter ? "rounded-md bg-muted px-2 py-1 font-medium" : "rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"}
            >
              {t.filter[f]}
            </Link>
          ))}
        </div>
      </div>

      {!migrationMissing && notStarted.length > 0 && (
        <BulkDraft
          locale={locale}
          items={notStarted}
          labels={{ start: t.bulkDraft, progress: t.bulkProgress, stop: t.bulkStop, done: t.bulkDone }}
        />
      )}

      {(Object.keys(CONTENT_TYPES) as ContentType[]).map((type) => {
        const group = shown.filter((i) => i.type === type);
        return (
          <section key={type} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.types[type]}
            </h2>
            {group.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            ) : (
              <ul className="divide-y rounded-xl border bg-card">
                {group.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/admin/translations/${item.type}/${item.id}?locale=${locale}`}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50"
                    >
                      <span className="min-w-0 flex-1">
                        <span lang="en" className="block truncate text-sm font-medium">{item.label}</span>
                        {item.context && (
                          <span className="block truncate text-xs text-muted-foreground">{item.context}</span>
                        )}
                      </span>
                      {item.outdated && <Badge variant="destructive">{t.outdated}</Badge>}
                      <Badge variant={stateBadgeVariant(item.state)}>{t.state[item.state]}</Badge>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
