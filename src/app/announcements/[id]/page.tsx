import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, ExternalLink } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/supabase/authorize";
import {
  ANNOUNCEMENT_COLUMNS,
  formatEventDate,
  getAnnouncementImageUrl,
  type Announcement,
} from "@/lib/supabase/announcements";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

// The full view of a News / Event / Advert / General announcement, opened
// from its Home banner. RLS only exposes active announcements to members
// (admins can see drafts too, which doubles as a preview).
export default async function AnnouncementPage(
  props: PageProps<"/announcements/[id]">,
) {
  const { id } = await props.params;
  const { supabase } = await requireUser();

  const { data: announcement } = await supabase
    .from("prayer_movements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("id", id)
    .maybeSingle<Announcement>();

  if (announcement?.kind === "prayer") {
    redirect("/prayer-room");
  }

  const dict = getDictionary(await getLocale());

  if (!announcement) {
    return (
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-6 py-10 text-center">
        <PatternBorder />
        <p className="text-muted-foreground">
          This announcement is no longer running.
        </p>
        <Button render={<Link href="/" />} nativeButton={false} size="lg">
          Back to Home
        </Button>
      </main>
    );
  }

  const imageUrl = getAnnouncementImageUrl(announcement.image_path);
  const isExternal = announcement.link_url?.startsWith("http") ?? false;

  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-5 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/" label="Home" />

      <div className="space-y-4 rounded-2xl border-2 border-primary/30 bg-card p-5 shadow-sm">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="w-full rounded-xl object-cover"
          />
        )}

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {dict.dashboard.announcementKinds[announcement.kind]}
          </p>
          <h1 className="font-heading text-2xl font-semibold text-balance">
            {announcement.title}
          </h1>
        </div>

        {announcement.kind === "event" && announcement.event_date && (
          <p className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="size-4 text-primary" />
            {formatEventDate(announcement.event_date)}
          </p>
        )}

        {announcement.body && (
          <p className="whitespace-pre-line leading-relaxed">
            {announcement.body}
          </p>
        )}

        {announcement.link_url && (
          <Button
            render={
              isExternal ? (
                <a
                  href={announcement.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ) : (
                <Link href={announcement.link_url} />
              )
            }
            nativeButton={false}
            size="lg"
            className="w-full"
          >
            {announcement.link_label || "Learn more"}
            {isExternal && <ExternalLink className="size-4" />}
          </Button>
        )}
      </div>
    </main>
  );
}
