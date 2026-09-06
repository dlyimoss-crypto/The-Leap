import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const today = new Date().toISOString().slice(0, 10);

  let featured: DevotionRow | null = null;
  let past: DevotionRow[] = [];

  if (idParam) {
    const { data } = await supabase
      .from("devotions")
      .select(
        "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
      )
      .eq("id", idParam)
      .maybeSingle<DevotionRow>();
    featured = data ?? null;

    const { data: pastRows } = await supabase
      .from("devotions")
      .select(
        "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
      )
      .lte("publish_date", today)
      .neq("id", idParam)
      .order("publish_date", { ascending: false })
      .limit(10)
      .returns<DevotionRow[]>();
    past = pastRows ?? [];
  } else {
    const { data, error } = await supabase
      .from("devotions")
      .select(
        "id, title, scripture_reference, body, reflection, prayer, practice, publish_date",
      )
      .lte("publish_date", today)
      .order("publish_date", { ascending: false })
      .limit(11)
      .returns<DevotionRow[]>();

    if (error) {
      console.error("Failed to load devotions", error);
    }

    const rows = data ?? [];
    featured = rows[0] ?? null;
    past = rows.slice(1);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <BackLink href="/evolve" label="Evolve" />
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Daily Devotion
        </h1>
        <p className="text-sm text-muted-foreground">
          Pause, reflect and encounter God in today&apos;s thought.
        </p>
      </div>

      {featured ? (
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
            {past.map((d) => (
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
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
