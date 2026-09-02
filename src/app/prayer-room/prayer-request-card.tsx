import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

function timeAgo(iso: string) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PrayerRequestCard({
  request,
  currentUserId,
  showManageActions,
}: {
  request: PrayerRequestRow;
  currentUserId: string;
  showManageActions: boolean;
}) {
  const isOwn = request.user_id === currentUserId;
  const authorLabel = request.is_anonymous
    ? "Anonymous"
    : (request.displayName ?? "A member of the community");

  return (
    <div className="space-y-2 rounded-xl border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold">
          {authorLabel}
          {request.is_anonymous && (
            <Badge variant="outline" className="ml-1.5 align-middle text-[9px]">
              hidden name
            </Badge>
          )}
          {showManageActions && request.status !== "open" && (
            <Badge variant="secondary" className="ml-1.5 align-middle text-[9px]">
              {request.status}
            </Badge>
          )}
        </span>
        <span className="font-mono text-[10.5px] text-muted-foreground">
          {timeAgo(request.created_at)}
        </span>
      </div>

      <p className="text-sm">{request.body}</p>

      {request.testimony && (
        <div className="mt-2 space-y-1 border-t border-dashed pt-2">
          <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-primary">
            Testimony
          </p>
          <p className="text-sm text-muted-foreground">{request.testimony}</p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <form action={prayForRequest.bind(null, request.id)}>
          <Button
            type="submit"
            size="sm"
            variant={request.hasPrayed ? "secondary" : "outline"}
            disabled={request.hasPrayed}
          >
            {request.hasPrayed ? "Prayed" : "I Prayed"} · {request.prayedCount}
          </Button>
        </form>
        {!isOwn && (
          <form action={reportPrayerRequest.bind(null, request.id)}>
            <Button type="submit" size="sm" variant="ghost">
              Report
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
            placeholder="How was this answered? (optional)"
            rows={1}
            className="flex-1"
          />
          <Button type="submit" size="sm" variant="outline">
            Mark answered
          </Button>
        </form>
      )}
    </div>
  );
}
