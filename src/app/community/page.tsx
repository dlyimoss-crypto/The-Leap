import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCommunityPrompt } from "@/lib/content/community-prompt";
import { Composer } from "./composer";
import { PostCard, type PostRow } from "./post-card";

type RawPost = {
  id: string;
  user_id: string;
  body: string;
  status: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
  comments: { count: number }[] | null;
};

export default async function CommunityPage(
  props: PageProps<"/community">,
) {
  const searchParams = await props.searchParams;
  const showCrisisBanner = searchParams.crisis === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const today = new Date().toISOString().slice(0, 10);
  const prompt = getCommunityPrompt(today);

  const [{ data: blocks }, { data: rawPosts, error }] = await Promise.all([
    supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id),
    supabase
      .from("posts")
      .select(
        "id, user_id, body, status, created_at, profiles(display_name), comments(count)",
      )
      .eq("status", "visible")
      .order("created_at", { ascending: false })
      .returns<RawPost[]>(),
  ]);
  const blockedIds = new Set((blocks ?? []).map((b) => b.blocked_id as string));

  if (error) {
    console.error("Failed to load posts", error);
  }

  const visiblePosts = (rawPosts ?? []).filter(
    (post) => !blockedIds.has(post.user_id),
  );
  const postIds = visiblePosts.map((post) => post.id);

  const { data: reactions } =
    postIds.length > 0
      ? await supabase
          .from("reactions")
          .select("post_id, user_id, type")
          .in("post_id", postIds)
      : { data: [] };

  const posts: PostRow[] = visiblePosts.map((post) => {
    const postReactions = (reactions ?? []).filter(
      (r) => r.post_id === post.id,
    );
    return {
      id: post.id,
      user_id: post.user_id,
      body: post.body,
      created_at: post.created_at,
      displayName: post.profiles?.display_name ?? null,
      encourageCount: postReactions.filter((r) => r.type === "encourage")
        .length,
      prayCount: postReactions.filter((r) => r.type === "pray").length,
      hasEncouraged: postReactions.some(
        (r) => r.type === "encourage" && r.user_id === user.id,
      ),
      hasPrayed: postReactions.some(
        (r) => r.type === "pray" && r.user_id === user.id,
      ),
      commentCount: post.comments?.[0]?.count ?? 0,
    };
  });

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold">Community</h1>
        <Link href="/" className="text-sm text-muted-foreground">
          Home
        </Link>
      </div>

      <Composer prompt={prompt} />

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
        {posts.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No posts yet — be the first to share.
          </p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={user.id} />
        ))}
      </div>
    </main>
  );
}
