import Link from "next/link";
import { HandHeart, MessageCircle, ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { blockUser, reportPost, toggleReaction } from "./actions";

export type PostRow = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  displayName: string | null;
  encourageCount: number;
  prayCount: number;
  hasEncouraged: boolean;
  hasPrayed: boolean;
  commentCount: number;
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

export function PostCard({
  post,
  currentUserId,
}: {
  post: PostRow;
  currentUserId: string;
}) {
  const isOwn = post.user_id === currentUserId;
  const authorLabel = post.displayName ?? "A member of the community";

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar name={post.displayName} />
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold">
              {authorLabel}
            </span>
            <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground">
              {timeAgo(post.created_at)}
            </span>
          </div>
          <p className="pt-0.5 text-sm">{post.body}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <form action={toggleReaction.bind(null, post.id, "encourage")}>
          <Button
            type="submit"
            size="sm"
            variant={post.hasEncouraged ? "secondary" : "outline"}
            className="rounded-full"
          >
            <ThumbsUp className="size-3.5" /> {post.encourageCount}
          </Button>
        </form>
        <form action={toggleReaction.bind(null, post.id, "pray")}>
          <Button
            type="submit"
            size="sm"
            variant={post.hasPrayed ? "secondary" : "outline"}
            className="rounded-full"
          >
            <HandHeart className="size-3.5" /> {post.prayCount}
          </Button>
        </form>
        <Button
          render={<Link href={`/community/${post.id}`} />}
          nativeButton={false}
          size="sm"
          variant="ghost"
          className="rounded-full"
        >
          <MessageCircle className="size-3.5" /> {post.commentCount}
        </Button>
        {!isOwn && (
          <div className="ml-auto flex gap-1">
            <form action={reportPost.bind(null, post.id)}>
              <Button type="submit" size="xs" variant="ghost">
                Report
              </Button>
            </form>
            <form action={blockUser.bind(null, post.user_id)}>
              <Button type="submit" size="xs" variant="ghost">
                Block
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
