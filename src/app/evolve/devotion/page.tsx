import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";

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

function formatDevotionDate(publishDate: string) {
  return new Date(`${publishDate}T00:00:00`).toLocaleDateString("en-US", {
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

  const past = pastRows ?? [];

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/evolve" label="Evolve" />
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Daily Devotion
        </h1>
        <p className="text-sm text-muted-foreground">
          Pause, reflect and encounter God in today&apos;s thought.
        </p>
      </div>

      {lockedOutUntilTomorrow ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <Lock className="size-8 text-muted-foreground/50" />
          <h2 className="text-lg font-heading font-semibold">
            You&apos;ve already picked one from the archive today
          </h2>
          <p className="text-sm text-muted-foreground">
            You can read one past devotion a day — this one unlocks again
            tomorrow. Today&apos;s devotion is still open below.
          </p>
          <Link
            href="/evolve/devotion"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Back to today&apos;s devotion
          </Link>
        </div>
      ) : featured ? (
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {formatDevotionDate(featured.publish_date)}
            </p>
            <h2 className="text-xl font-heading font-semibold text-balance">
              {featured.title}
            </h2>
          </div>

          {featured.scripture_reference && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-base font-medium text-primary italic">
                {featured.scripture_reference}
              </p>
            </div>
          )}

          <p className="whitespace-pre-line text-foreground">
            {featured.body}
          </p>

          {featured.reflection && (
            <div className="space-y-1">
              <p className="text-base font-semibold uppercase tracking-wide text-primary">
                Reflection
              </p>
              <p className="whitespace-pre-line text-foreground">
                {featured.reflection}
              </p>
            </div>
          )}

          {featured.prayer && (
            <div className="space-y-1">
              <p className="text-base font-semibold uppercase tracking-wide text-primary">
                Prayer
              </p>
              <p className="whitespace-pre-line text-foreground">
                {featured.prayer}
              </p>
            </div>
          )}

          {featured.practice && (
            <div className="space-y-1">
              <p className="text-base font-semibold uppercase tracking-wide text-primary">
                Practice
              </p>
              <p className="whitespace-pre-line text-foreground">
                {featured.practice}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <Sparkles className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No devotion has been published yet — check back soon.
          </p>
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Past Devotions
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
                  <span className="truncate text-sm font-medium">
                    {d.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[10.5px]">
                    <Lock className="size-3" />
                    Tomorrow
                  </span>
                </div>
              ) : (
                <Link
                  key={d.id}
                  href={`/evolve/devotion?id=${d.id}`}
                  className="flex items-center justify-between gap-3 p-3 hover:bg-muted/50"
                >
                  <span className="truncate text-sm font-medium">
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
