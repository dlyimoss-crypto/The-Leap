import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import { formatDate } from "@/lib/i18n/format";
import { DevotionReminder } from "./devotion-reminder";
import { TranslationNotice } from "@/components/language/translation-notice";
import { localizeRow, localizeRows } from "@/lib/localization/content";

type DevotionRow = {
  id: string;
  title: string;
  scripture_reference: string | null;
  body: string;
  reflection: string | null;
  prayer: string | null;
  practice: string | null;
  publish_date: string;
};

function formatDevotionDate(locale: Locale, publishDate: string) {
  return formatDate(locale, publishDate, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function DevotionPage(
  props: PageProps<"/evolve/devotion">,
) {
  const searchParams = await props.searchParams;
  const idParam = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;

  const { supabase, user } = await requireUser();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.evolve.devotion;

  const today = new Date().toISOString().slice(0, 10);

  const { data: todaysRow, error: todaysError } = await supabase
    .from("devotions")
    .select(
      "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
    )
    .lte("publish_date", today)
    .order("publish_date", { ascending: false })
    .limit(1)
    .maybeSingle<DevotionRow>();

  if (todaysError) {
    console.error("Failed to load today's devotion", todaysError);
  }

  const isArchiveRequest = Boolean(idParam) && idParam !== todaysRow?.id;

  const { data: existingChoice } = await supabase
    .from("devotion_archive_reads")
    .select("devotion_id")
    .eq("user_id", user.id)
    .eq("read_date", today)
    .maybeSingle<{ devotion_id: string }>();

  let featured: DevotionRow | null = null;
  // Set only when an archive pick was requested but a *different* one was
  // already chosen today — used to render the locked state instead of the
  // devotion, and to grey out the rest of the archive list below.
  let lockedOutUntilTomorrow = false;
  let chosenArchiveId: string | null = existingChoice?.devotion_id ?? null;

  if (!isArchiveRequest) {
    featured = todaysRow ?? null;

    // Clears the home screen's "new today" badge and tells the reminder
    // job this reader doesn't need a nudge.
    if (todaysRow) {
      const { error: readError } = await supabase
        .from("devotion_reads")
        .upsert(
          { user_id: user.id, devotion_id: todaysRow.id },
          { onConflict: "user_id,devotion_id", ignoreDuplicates: true },
        );
      if (readError) {
        console.error("Failed to record devotion read", readError);
      }
    }
  } else if (!existingChoice) {
    const { error: insertError } = await supabase
      .from("devotion_archive_reads")
      .insert({ user_id: user.id, read_date: today, devotion_id: idParam });

    if (insertError) {
      console.error("Failed to record devotion archive pick", insertError);
    }
    chosenArchiveId = idParam ?? null;

    const { data } = await supabase
      .from("devotions")
      .select(
        "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
      )
      .eq("id", idParam)
      .maybeSingle<DevotionRow>();
    featured = data ?? null;
  } else if (existingChoice.devotion_id === idParam) {
    const { data } = await supabase
      .from("devotions")
      .select(
        "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
      )
      .eq("id", idParam)
      .maybeSingle<DevotionRow>();
    featured = data ?? null;
  } else {
    lockedOutUntilTomorrow = true;
  }

  const { data: pastRows } = await supabase
    .from("devotions")
    .select(
      "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
    )
    .lte("publish_date", today)
    .neq("id", featured?.id ?? todaysRow?.id ?? "")
    .order("publish_date", { ascending: false })
    .limit(10)
    .returns<DevotionRow[]>();

  // Shown in the reader's language when a published translation exists,
  // otherwise in English with a notice (see TranslationNotice).
  const [shown, past] = await Promise.all([
    localizeRow(supabase, "devotion", featured, locale),
    localizeRows(supabase, "devotion", pastRows ?? [], locale),
  ]);

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/evolve" label={dict.nav.evolve} />
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          {t.heading}
        </h1>
        <p className="text-sm text-muted-foreground">{t.subheading}</p>
      </div>

      <DevotionReminder dict={dict.evolve.reminder} locale={locale} />

      {lockedOutUntilTomorrow ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <Lock className="size-8 text-muted-foreground/50" />
          <h2 className="text-lg font-heading font-semibold">
            {t.lockedHeading}
          </h2>
          <p className="text-sm text-muted-foreground">{t.lockedBody}</p>
          <Link
            href="/evolve/devotion"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            {t.backToToday}
          </Link>
        </div>
      ) : shown ? (
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <TranslationNotice servedLocale={shown.servedLocale} />
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {formatDevotionDate(locale, shown.publish_date)}
            </p>
            <h2 lang={shown.servedLocale} className="text-xl font-heading font-semibold text-balance">
              {shown.title}
            </h2>
          </div>

          {shown.scripture_reference && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-base font-medium text-primary italic">
                {shown.scripture_reference}
              </p>
            </div>
          )}

          <p lang={shown.servedLocale} className="whitespace-pre-line text-foreground">
            {shown.body}
          </p>

          {shown.reflection && (
            <div className="space-y-1">
              <p className="text-base font-semibold uppercase tracking-wide text-primary">
                {t.reflection}
              </p>
              <p lang={shown.servedLocale} className="whitespace-pre-line text-foreground">
                {shown.reflection}
              </p>
            </div>
          )}

          {shown.prayer && (
            <div className="space-y-1">
              <p className="text-base font-semibold uppercase tracking-wide text-primary">
                {t.prayer}
              </p>
              <p lang={shown.servedLocale} className="whitespace-pre-line text-foreground">
                {shown.prayer}
              </p>
            </div>
          )}

          {shown.practice && (
            <div className="space-y-1">
              <p className="text-base font-semibold uppercase tracking-wide text-primary">
                {t.practice}
              </p>
              <p lang={shown.servedLocale} className="whitespace-pre-line text-foreground">
                {shown.practice}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <Sparkles className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t.empty}
          </p>
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t.pastDevotions}
          </p>
          <div className="divide-y rounded-xl border bg-card">
            {past.map((d) => {
              const locked =
                chosenArchiveId !== null && chosenArchiveId !== d.id;

              return locked ? (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3 p-3 text-muted-foreground"
                >
                  <span lang={d.servedLocale} className="truncate text-sm font-medium">
                    {d.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[10.5px]">
                    <Lock className="size-3" />
                    {t.tomorrow}
                  </span>
                </div>
              ) : (
                <Link
                  key={d.id}
                  href={`/evolve/devotion?id=${d.id}`}
                  className="flex items-center justify-between gap-3 p-3 hover:bg-muted/50"
                >
                  <span lang={d.servedLocale} className="truncate text-sm font-medium">
                    {d.title}
                  </span>
                  <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground">
                    {d.publish_date}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
