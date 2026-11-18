import { Users } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PatternBorder } from "@/components/pattern-bg";
import { requireUser } from "@/lib/supabase/authorize";
import { getCommunityPrompt } from "@/lib/content/community-prompt";
import { getLocale } from "@/lib/i18n/get-locale";
import { wordSpace } from "@/lib/i18n/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
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

  const { supabase, user } = await requireUser();
  const dict = getDictionary(await getLocale());
  const sp = wordSpace(await getLocale());
  const t = dict.community;

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
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-4 overflow-hidden px-6 py-10">
      <PatternBorder />
      <BackLink href="/" label={dict.nav.home} />
      <h1 className="text-2xl font-heading font-semibold">
        {t.communityPage.heading}
      </h1>

      <Composer prompt={prompt} dict={t.composer} />

      {showCrisisBanner && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-foreground">
          {t.crisisBanner.intro}{sp}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-destructive underline"
          >
            {t.crisisBanner.findSupportLink}
          </a>{sp}
          {t.crisisBanner.outro}
        </div>
      )}

      <div className="space-y-3">
        {posts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {t.communityPage.empty}
            </p>
          </div>
        )}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={user.id}
            dict={t}
          />
        ))}
      </div>
    </main>
  );
}
