import { Heart } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CommunityMessages } from "@/lib/i18n/messages/en/community";
import { markAnswered, prayForRequest, reportPrayerRequest } from "./actions";

export type PrayerRequestRow = {
  id: string;
  user_id: string;
  body: string;
  visibility: "public" | "private";
  is_anonymous: boolean;
  status: "open" | "answered" | "hidden" | "removed";
  testimony: string | null;
  created_at: string;
  displayName: string | null;
  prayedCount: number;
  hasPrayed: boolean;
};

function timeAgo(iso: string, t: CommunityMessages["timeAgo"]) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (seconds < 60) return t.justNow;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t.minutes(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.hours(hours);
  const days = Math.floor(hours / 24);
  return t.days(days);
}

export function PrayerRequestCard({
  request,
  currentUserId,
  showManageActions,
  dict,
}: {
  request: PrayerRequestRow;
  currentUserId: string;
  showManageActions: boolean;
  dict: CommunityMessages;
}) {
  const t = dict.prayerRequest;
  const isOwn = request.user_id === currentUserId;
  const authorLabel = request.is_anonymous
    ? t.anonymous
    : (request.displayName ?? dict.communityMember);

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar name={request.is_anonymous ? null : request.displayName} />
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold">
              {authorLabel}
            </span>
            <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground">
              {timeAgo(request.created_at, dict.timeAgo)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {request.is_anonymous && (
              <Badge variant="outline" className="text-[9px]">
                {t.hiddenName}
              </Badge>
            )}
            {showManageActions && request.status !== "open" && (
              <Badge variant="secondary" className="text-[9px]">
                {t.status[request.status]}
              </Badge>
            )}
          </div>
          <p className="pt-0.5 text-sm">{request.body}</p>
        </div>
      </div>

      {request.testimony && (
        <div className="space-y-1 border-t border-dashed pt-2">
          <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-primary">
            {t.testimony}
          </p>
          <p className="text-sm text-muted-foreground">{request.testimony}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Heart className="size-4 fill-primary/20 text-primary" />
          {request.prayedCount}
        </span>
        <form action={prayForRequest.bind(null, request.id)} className="ms-auto">
          <Button
            type="submit"
            size="sm"
            variant={request.hasPrayed ? "secondary" : "default"}
            disabled={request.hasPrayed}
            className="rounded-full"
          >
            {request.hasPrayed ? t.prayed : t.pray}
          </Button>
        </form>
        {!isOwn && (
          <form action={reportPrayerRequest.bind(null, request.id)}>
            <Button type="submit" size="sm" variant="ghost">
              {dict.report}
            </Button>
          </form>
        )}
      </div>

      {showManageActions && isOwn && request.status === "open" && (
        <form
          action={markAnswered.bind(null, request.id)}
          className="flex items-end gap-2 pt-1"
        >
          <Textarea
            name="testimony"
            placeholder={t.testimonyPlaceholder}
            rows={1}
            className="flex-1"
          />
          <Button type="submit" size="sm" variant="outline">
            {t.markAnswered}
          </Button>
        </form>
      )}
    </div>
  );
}
