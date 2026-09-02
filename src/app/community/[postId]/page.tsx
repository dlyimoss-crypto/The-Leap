import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { addComment } from "../actions";

type PostWithAuthor = {
  id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
};

type CommentWithAuthor = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
};

export default async function PostDetailPage(
  props: PageProps<"/community/[postId]">,
) {
  const { postId } = await props.params;
  const searchParams = await props.searchParams;
  const showCrisisBanner = searchParams.crisis === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [{ data: post }, { data: comments }, { data: blocks }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("id, body, created_at, profiles(display_name)")
        .eq("id", postId)
        .eq("status", "visible")
        .maybeSingle<PostWithAuthor>(),
      supabase
        .from("comments")
        .select("id, user_id, body, created_at, profiles(display_name)")
        .eq("post_id", postId)
        .eq("status", "visible")
        .order("created_at", { ascending: true })
        .returns<CommentWithAuthor[]>(),
      supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id),
    ]);

  if (!post) {
    notFound();
  }

  const blockedIds = new Set((blocks ?? []).map((b) => b.blocked_id as string));
  const visibleComments = (comments ?? []).filter(
    (comment) => !blockedIds.has(comment.user_id),
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <Link href="/community" className="text-sm text-muted-foreground">
        &larr; Community
      </Link>

      <div className="space-y-2 rounded-xl border bg-card p-4">
        <p className="text-sm font-semibold">
          {post.profiles?.display_name ?? "A member of the community"}
        </p>
        <p className="text-sm">{post.body}</p>
      </div>

      {showCrisisBanner && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
          You don&apos;t have to go through this alone. If you&apos;re in
          immediate danger or thinking about harming yourself, please seek
          immediate help.{" "}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-destructive underline"
          >
            Find crisis support in your country →
          </a>{" "}
          You can also contact a trusted person, local church, professional
          counselor, or emergency service.
        </div>
      )}

      <div className="space-y-3">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="rounded-lg border bg-card p-3">
            <p className="text-xs font-semibold">
              {comment.profiles?.display_name ?? "A member of the community"}
            </p>
            <p className="text-sm">{comment.body}</p>
          </div>
        ))}
        {visibleComments.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No comments yet.
          </p>
        )}
      </div>

      <form
        action={addComment.bind(null, postId)}
        className="flex items-end gap-2"
      >
        <Textarea
          name="body"
          placeholder="Add a comment…"
          required
          rows={1}
          className="flex-1"
        />
        <Button type="submit" size="sm">
          Post
        </Button>
      </form>
    </main>
  );
}
