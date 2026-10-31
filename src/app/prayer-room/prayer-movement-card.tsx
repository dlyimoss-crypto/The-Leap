import { CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAnnouncementDaysLeft,
  getAnnouncementImageUrl,
  type Announcement,
} from "@/lib/supabase/announcements";
import { joinPrayerMovement } from "./actions";

export function PrayerMovementCard({
  movement,
  participantCount,
  hasPrayed,
}: {
  movement: Announcement;
  participantCount: number;
  hasPrayed: boolean;
}) {
  const daysLeft = getAnnouncementDaysLeft(movement.active_until);
  const imageUrl = getAnnouncementImageUrl(movement.image_path);

  return (
    <div className="space-y-3 rounded-2xl border-2 border-primary/30 bg-card p-4 shadow-sm">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="aspect-video w-full rounded-xl object-cover"
        />
      )}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Let&apos;s pray for 5 minutes
          </p>
          {daysLeft !== null && (
            <p className="shrink-0 text-xs font-medium text-muted-foreground">
              {daysLeft} day{daysLeft === 1 ? "" : "s"} left
            </p>
          )}
        </div>
        <h2 className="font-heading text-lg font-semibold text-balance">
          {movement.title}
        </h2>
        {movement.body && (
          <p className="whitespace-pre-line text-sm">{movement.body}</p>
        )}
        {movement.scripture_reference && (
          <p className="text-sm text-muted-foreground">
            {movement.scripture_reference}
          </p>
        )}
      </div>

      {movement.prayer_points.length > 0 && (
        <ul className="space-y-1.5">
          {movement.prayer_points.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {movement.link_url && (
        <a
          href={movement.link_url}
          {...(movement.link_url.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {movement.link_label || "Learn more"}
        </a>
      )}

      <div className="flex items-center gap-3 pt-1">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="size-4" />
          {participantCount} prayed
        </span>
        <form
          action={joinPrayerMovement.bind(null, movement.id)}
          className="ml-auto"
        >
          <Button
            type="submit"
            size="sm"
            variant={hasPrayed ? "secondary" : "default"}
            disabled={hasPrayed}
            className="rounded-full"
          >
            <CheckCircle2 className="size-4" />
            {hasPrayed ? "Prayed" : "I have prayed"}
          </Button>
        </form>
      </div>
    </div>
  );
}
